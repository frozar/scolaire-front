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

  function updateServiceCase1(
    service: ServiceType,
    tripId: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    tripDuration: number
  ) {
    const endHour =
      tripDirection == TripDirectionEnum.going
        ? minTimeOfTimeRange
        : minTimeOfTimeRange + tripDuration;

    service.serviceTripsOrdered.push({
      tripId: tripId,
      hlp: 0,
      endHour,
      waitingTime: 0,
      startHour: endHour - tripDuration,
    });
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
  function updateServiceCase4(
    service: ServiceType,
    tripId: number,
    hlp: number,
    earliestEndHour: number,
    tripDuration: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): void {
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
      service.serviceTripsOrdered.push({
        tripId,
        hlp,
        endHour: earliestEndHour,
        waitingTime: 0,
        startHour: earliestEndHour - tripDuration,
      });
      return;
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
      service.serviceTripsOrdered.push({
        tripId,
        hlp,
        endHour: earliestEndHour,
        waitingTime: 0,
        startHour: earliestEndHour - tripDuration,
      });
      return;
    }

    // serviceTrip put in place of the waiting time
    service.serviceTripsOrdered.splice(indexOfWaitingTime, 0, {
      tripId,
      hlp: newHlp,
      endHour: _earliestArrivalHour,
      waitingTime:
        _earliestArrivalHour - tripDuration - newHlp - waitingTimeStart,
      startHour: _earliestArrivalHour - tripDuration,
    });
    service.serviceTripsOrdered[indexOfWaitingTime + 1].waitingTime -=
      tripDuration + newHlp;
    return;
  }

  function getNeededVariables(service: ServiceType, serviceTripIndex: number) {
    const tripId = service.tripIds[serviceTripIndex];
    const tripDuration = ServiceGridUtils.getTripDuration(tripId);
    const tripDirection = TripDirectionEntity.FindDirectionById(
      TripUtils.get(tripId).tripDirectionId
    ).type;
    const minTimeOfTimeRange = ServiceGridUtils.getEarliestArrival(tripId);

    return { tripId, tripDuration, tripDirection, minTimeOfTimeRange };
  }

  function getNeededVariablesBis(
    service: ServiceType,
    serviceTripIndex: number,
    tripId: number,
    tripDuration: number
  ) {
    /*
    Computation for hlp, earliestEndHour, earliestDepartureHour use
    the last serviceTrip of serviceTripsOrdered as the previous serviceTrip
    */
    const hlp = ServiceGridUtils.getHlpDuration(
      service.tripIds,
      service.serviceTripsOrdered,
      serviceTripIndex
    );

    const maxTimeOfTimeRange = ServiceGridUtils.getLatestArrival(tripId);

    const earliestEndHour =
      (service.serviceTripsOrdered.at(-1) as ServiceTripOrderedType).endHour +
      hlp +
      tripDuration;

    const earliestDepartureHour =
      (service.serviceTripsOrdered.at(-1) as ServiceTripOrderedType).endHour +
      hlp;

    return { hlp, maxTimeOfTimeRange, earliestEndHour, earliestDepartureHour };
  }

  export function getUpdatedServices(_services: ServiceType[]): ServiceType[] {
    /*
    Create service.serviceTripsOrdered depending on service.tripIds
    - Specify hlp, endHour, startHour, waitingTime
    - Order the trips (case 4)
    */

    for (const service of _services) {
      service.serviceTripsOrdered = [];

      for (const serviceTripIndex of [
        ...Array(service.tripIds.length).keys(),
      ]) {
        const { tripId, tripDuration, tripDirection, minTimeOfTimeRange } =
          getNeededVariables(service, serviceTripIndex);

        // Case 1 : First serviceTrip
        if (serviceTripIndex == 0) {
          updateServiceCase1(
            service,
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
        } = getNeededVariablesBis(
          service,
          serviceTripIndex,
          tripId,
          tripDuration
        );

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
            service.serviceTripsOrdered.push({
              tripId,
              hlp,
              endHour: earliestEndHour,
              waitingTime: 0,
              startHour: earliestEndHour - tripDuration,
            });
            continue;

          case CaseEnum.case3:
            // Earliest arrival or departure before time range
            const waitingTime =
              tripDirection == TripDirectionEnum.going
                ? minTimeOfTimeRange - earliestEndHour
                : minTimeOfTimeRange - earliestDepartureHour;

            const endHour = earliestEndHour + waitingTime;

            service.serviceTripsOrdered.push({
              tripId,
              hlp,
              endHour,
              waitingTime,
              startHour: endHour - tripDuration,
            });
            continue;

          case CaseEnum.case4:
            updateServiceCase4(
              service,
              tripId,
              hlp,
              earliestEndHour,
              tripDuration,
              tripDirection,
              minTimeOfTimeRange,
              maxTimeOfTimeRange
            );
            continue;
        }
      }
    }
    return _services;
  }
}
