import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import {
  ServiceTripOrderedType,
  ServiceType,
} from "../views/content/service/organism/Services";
import { hlpMatrix } from "../views/content/service/template/ServiceTemplate";
import { ServiceGridUtils } from "./serviceGrid.utils";
import { TripUtils } from "./trip.utils";

export enum CaseEnum {
  case1,
  case2,
  case3,
  case4,
}

export namespace ServiceTripOrderedUtils {
  export function isCase2(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): boolean {
    /* Case 2 => Earliest arrival or departure in the time range */

    return tripDirection == TripDirectionEnum.going
      ? /* Aller */
        minTimeOfTimeRange <= earliestEndHour &&
          earliestEndHour <= maxTimeOfTimeRange
      : /* Retour */
        minTimeOfTimeRange <= earliestDepartureHour &&
          earliestDepartureHour <= maxTimeOfTimeRange;
  }

  function isCase3(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number
  ): boolean {
    /* Case 3 => Earliest arrival or departure before time range */

    return tripDirection == TripDirectionEnum.going
      ? /* Aller */
        earliestEndHour < minTimeOfTimeRange
      : /* Retour */
        earliestDepartureHour < minTimeOfTimeRange;
  }

  function isCase4(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    maxTimeOfTimeRange: number
  ): boolean {
    /* Case 4 => Earliest arrival or departure after time range */

    return tripDirection == TripDirectionEnum.going
      ? /* Aller */
        earliestEndHour > maxTimeOfTimeRange
      : /* Retour */
        earliestDepartureHour > maxTimeOfTimeRange;
  }

  function getCaseNumber(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): CaseEnum | void {
    if (
      ServiceTripOrderedUtils.isCase2(
        earliestDepartureHour,
        earliestEndHour,
        tripDirection,
        minTimeOfTimeRange,
        maxTimeOfTimeRange
      )
    )
      return CaseEnum.case2;
    else if (
      isCase3(
        earliestDepartureHour,
        earliestEndHour,
        tripDirection,
        minTimeOfTimeRange
      )
    )
      return CaseEnum.case3;
    else if (
      isCase4(
        earliestDepartureHour,
        earliestEndHour,
        tripDirection,
        maxTimeOfTimeRange
      )
    )
      return CaseEnum.case4;
    return;
  }

  // TODO: Rename
  function updateServiceCase1Enhanced(
    newServiceTripsOrdered: ServiceTripOrderedType[],
    tripId: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    tripDuration: number
  ): ServiceTripOrderedType[] {
    const endHour =
      tripDirection == TripDirectionEnum.going
        ? minTimeOfTimeRange
        : minTimeOfTimeRange + tripDuration;

    newServiceTripsOrdered.push({
      tripId: tripId,
      hlp: 0,
      endHour,
      waitingTime: 0,
      startHour: endHour - tripDuration,
    });

    return newServiceTripsOrdered;
  }

  // TODO: Deal with multiple waiting times
  function isToPutToTheEnd(
    waitingTimes: number[],
    _earliestDepartureHour: number,
    _earliestArrivalHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number,
    waitingTimeDuration: number,
    newHlp: number,
    tripDuration: number
  ): boolean {
    /*
    Used only in case 4 
    conditions to put the serviceTrip
    at the end of serviceTripsOrdered
    */

    return (
      // If no waiting time
      !waitingTimes.some((waitingTime) => waitingTime > 0) ||
      // If waiting time out of the time range
      !ServiceTripOrderedUtils.isCase2(
        _earliestDepartureHour,
        _earliestArrivalHour,
        tripDirection,
        minTimeOfTimeRange,
        maxTimeOfTimeRange
      ) ||
      // If waiting time duration is not big enough
      waitingTimeDuration < newHlp + tripDuration
    );
  }

  // TODO: Enhance function to deal with multiple waitingTimes in one serviceTripsOrdered
  // TODO: Rename
  function updateServiceCase4Enhanced(
    service: ServiceType,
    tripId: number,
    hlp: number,
    earliestEndHour: number,
    tripDuration: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number,
    newServiceTrips: ServiceTripOrderedType[]
  ): ServiceTripOrderedType[] {
    /*
    Case 4 : Earliest arrival or departure after time range

    If right waiting time existing => serviceTrip put in this place
    Else => serviceTrip puted at the end of serviceTripsOrdered
    */

    const waitingTimes = service.serviceTripsOrdered.map(
      (serviceTrip) => serviceTrip.waitingTime
    );
    const waitingTimeDuration = waitingTimes.filter(
      (waitingTime) => waitingTime > 0
    )[0];

    if (!waitingTimeDuration) {
      newServiceTrips.push({
        tripId,
        hlp,
        endHour: earliestEndHour,
        waitingTime: 0,
        startHour: earliestEndHour - tripDuration,
      });
      return newServiceTrips;
    }

    const indexOfWaitingTime = waitingTimes.indexOf(waitingTimeDuration);
    const waitingTimeStart =
      service.serviceTripsOrdered[indexOfWaitingTime - 1].endHour;
    const newHlp =
      hlpMatrix()[tripId][
        service.serviceTripsOrdered[indexOfWaitingTime].tripId
      ];
    const _earliestDepartureHour = waitingTimeStart + hlp;
    const _earliestArrivalHour = waitingTimeStart + hlp + tripDuration;

    if (
      isToPutToTheEnd(
        waitingTimes,
        _earliestDepartureHour,
        _earliestArrivalHour,
        tripDirection,
        minTimeOfTimeRange,
        maxTimeOfTimeRange,
        waitingTimeDuration,
        newHlp,
        tripDuration
      )
    ) {
      newServiceTrips.push({
        tripId,
        hlp,
        endHour: earliestEndHour,
        waitingTime: 0,
        startHour: earliestEndHour - tripDuration,
      });
      return newServiceTrips;
    }

    // serviceTrip put in place of the waiting time
    newServiceTrips.splice(indexOfWaitingTime, 0, {
      tripId,
      hlp: newHlp,
      endHour: _earliestArrivalHour,
      waitingTime:
        _earliestArrivalHour - tripDuration - newHlp - waitingTimeStart,
      startHour: _earliestArrivalHour - tripDuration,
    });
    newServiceTrips[indexOfWaitingTime + 1].waitingTime -=
      tripDuration + newHlp;
    return newServiceTrips;
  }

  function getNeededVariables(
    serviceTripIndex: number,
    serviceTripIds: number[]
  ) {
    const tripId = serviceTripIds[serviceTripIndex];
    const tripDuration = ServiceGridUtils.getTripDuration(tripId);
    const tripDirection = TripDirectionEntity.FindDirectionById(
      TripUtils.get(tripId).tripDirectionId
    ).type;
    const minTimeOfTimeRange = ServiceGridUtils.getEarliestArrival(tripId);

    return { tripId, tripDuration, tripDirection, minTimeOfTimeRange };
  }

  // TODO: Rename
  function getNeededVariablesBisEnhanced(
    newServiceTrips: ServiceTripOrderedType[],
    serviceTripIndex: number,
    tripId: number,
    tripDuration: number,
    tripIds: number[]
  ) {
    /*
    Computation for hlp, earliestEndHour, earliestDepartureHour use
    the last serviceTrip of serviceTripsOrdered as the previous serviceTrip
    */
    const hlp = ServiceGridUtils.getHlpDuration(tripIds, serviceTripIndex);

    const maxTimeOfTimeRange = ServiceGridUtils.getLatestArrival(tripId);

    // TODO: Use tripIds instead of service.serviceTripsOrdered
    const earliestEndHour =
      (newServiceTrips.at(-1) as ServiceTripOrderedType).endHour +
      hlp +
      tripDuration;

    const earliestDepartureHour =
      (newServiceTrips.at(-1) as ServiceTripOrderedType).endHour + hlp;

    return { hlp, maxTimeOfTimeRange, earliestEndHour, earliestDepartureHour };
  }

  // TODO: Massive cleaning
  // ! Instead of modifying directly `service.serviceTripsOrdered`
  // ! create newServiceTripsOrdered and erase
  // ! change to make it return something OR directly do the set()
  export function getUpdatedService(
    service: ServiceType,
    tripIds: number[],
    // TODO: Expliquer utilisation de ce paramètre !
    allowCase4: boolean
  ): ServiceTripOrderedType[] {
    /* Update values : hlp, startHour, endHour, waitingTime */

    let newServiceTripsOrdered: ServiceTripOrderedType[] = [];

    for (const serviceTripIndex of [...Array(tripIds.length).keys()]) {
      const { tripId, tripDuration, tripDirection, minTimeOfTimeRange } =
        getNeededVariables(serviceTripIndex, tripIds);

      // Case 1 : First serviceTrip
      if (serviceTripIndex == 0) {
        console.log("case 1");

        newServiceTripsOrdered = updateServiceCase1Enhanced(
          newServiceTripsOrdered,
          tripId,
          tripDirection,
          minTimeOfTimeRange,
          tripDuration
        );
        continue;
      }

      const {
        hlp,
        maxTimeOfTimeRange,
        earliestEndHour,
        earliestDepartureHour,
      } = getNeededVariablesBisEnhanced(
        newServiceTripsOrdered,
        serviceTripIndex,
        tripId,
        tripDuration,
        tripIds
      );

      if (tripId == 748) {
        console.log(
          hlp,
          maxTimeOfTimeRange,
          earliestEndHour,
          earliestDepartureHour
        );
      }

      switch (
        getCaseNumber(
          earliestDepartureHour,
          earliestEndHour,
          tripDirection,
          minTimeOfTimeRange,
          maxTimeOfTimeRange
        )
      ) {
        /* Case1 already done */

        case CaseEnum.case2:
          // Earliest arrival or departure in the time range
          console.log("case 2");

          newServiceTripsOrdered.push({
            tripId,
            hlp,
            endHour: earliestEndHour,
            waitingTime: 0,
            startHour: earliestEndHour - tripDuration,
          });
          continue;

        case CaseEnum.case3:
          // Earliest arrival or departure before time range
          console.log("case 3");

          const waitingTime =
            tripDirection == TripDirectionEnum.going
              ? minTimeOfTimeRange - earliestEndHour
              : minTimeOfTimeRange - earliestDepartureHour;

          console.log("waiting time", waitingTime);

          const endHour = earliestEndHour + waitingTime;

          newServiceTripsOrdered.push({
            tripId,
            hlp,
            endHour,
            waitingTime,
            startHour: endHour - tripDuration,
          });
          continue;

        case CaseEnum.case4:
          if (allowCase4) {
            console.log("case 4 allowed");

            newServiceTripsOrdered = updateServiceCase4Enhanced(
              service,
              tripId,
              hlp,
              earliestEndHour,
              tripDuration,
              tripDirection,
              minTimeOfTimeRange,
              maxTimeOfTimeRange,
              newServiceTripsOrdered
            );
          } else {
            console.log("case 4 not allowed");
            newServiceTripsOrdered.push({
              tripId,
              hlp,
              endHour: earliestEndHour,
              waitingTime: 0,
              startHour: earliestEndHour - tripDuration,
            });
          }
          continue;
      }
    }

    return newServiceTripsOrdered;
  }
}
