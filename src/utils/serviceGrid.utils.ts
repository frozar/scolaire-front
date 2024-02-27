import { GradeEntity } from "../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { TripPointType } from "../_entities/trip.entity";
import { zoom } from "../views/content/service/organism/ServiceGrid";
import {
  ServiceTripOrderedType,
  ServiceType,
  services,
} from "../views/content/service/organism/Services";
import {
  hlpMatrix,
  selectedService,
} from "../views/content/service/template/ServiceTemplate";
import { TripUtils } from "./trip.utils";

export type HlpMatrixType = {
  /*
  
  hlpMatrix contains hlp durations between
    start of sourceTrip and end of targetTrip
  
  The keys of each dict correspond to the tripId

  Exemple:
  {
    "715": {
      "716": 12,
      "721": 12,
    },
    "716": {
      "715": 8,
      "721": 8,
    },
    "721": {
      "715": 18,
      "716": 18,
    },
  };

  */
  [sourceTripId: number]: { [targetTripId: number]: number };
};

export namespace ServiceGridUtils {
  export function widthCssValue(width: number): string {
    return String(width * zoom()) + "px";
  }

  export function scrollToServiceStart(
    ref: HTMLDivElement,
    serviceId: number,
    scrollSmooth: boolean
  ): void {
    /*
    Scroll to the beginning service
    Only change position of scroll in axis x
    */

    const actualService = services().filter(
      (service) => service.id == serviceId
    )[0];
    if (!actualService) return;
    if (actualService.serviceTripsOrdered.length == 0) return;

    const endHour = actualService.serviceTripsOrdered[0].endHour;

    if (!scrollSmooth) ref.style.scrollBehavior = "auto";

    ref.scrollTo((endHour - 25) * zoom(), ref.scrollTop);

    if (!scrollSmooth) ref.style.scrollBehavior = "smooth";
  }

  export function changeScrollingDirection(
    divToScroll: HTMLDivElement,
    eventListennerDiv: HTMLDivElement
  ): void {
    const scrollSpeed = 2;

    eventListennerDiv.addEventListener("wheel", (event) => {
      event.preventDefault();

      divToScroll.scrollLeft += event.deltaY * scrollSpeed;
    });
  }

  // TODO: Refactor
  export function adaptScrollPositionToZoomIn(ref: HTMLDivElement): void {
    ref.style.scrollBehavior = "auto";

    const scrollPositionInMinutes = ref.scrollLeft / (zoom() - 1);
    ref.scrollTo(scrollPositionInMinutes * zoom(), ref.scrollTop);

    ref.style.scrollBehavior = "smooth";
  }

  export function adaptScrollPositionToZoomOut(ref: HTMLDivElement): void {
    ref.style.scrollBehavior = "auto";

    const scrollPositionInMinutes = ref.scrollLeft / (zoom() + 1);
    ref.scrollTo(scrollPositionInMinutes * zoom(), ref.scrollTop);

    ref.style.scrollBehavior = "smooth";
  }

  export function firstDivWidth(serviceIndex: number): string {
    return (
      ServiceGridUtils.getEarliestStart(
        services()[serviceIndex].serviceTripsOrdered[0].tripId
      ) *
        zoom() +
      "px"
    );
  }

  export function getTripDuration(tripId: number): number {
    /* Return minutes */
    return Math.round((TripUtils.get(tripId).metrics?.duration as number) / 60);
  }

  export function getStartStopName(tripId: number): string {
    return TripUtils.get(tripId).tripPoints[0].name;
  }

  export function getEndStopName(tripId: number): string {
    return (TripUtils.get(tripId).tripPoints.at(-1) as TripPointType).name;
  }

  export function getStringHourFormatFromMinutes(totalMinutes: number): string {
    const hour = Math.trunc(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return GradeEntity.getStringFromHourFormat({ hour, minutes });
  }

  export function getEarliestStart(tripId: number): number {
    /* return minutes */

    const firstTrip = TripUtils.get(tripId);
    const tripDuration = Math.round(
      (firstTrip.metrics?.duration as number) / 60
    );

    const earliestArrival = ServiceGridUtils.getEarliestArrival(tripId);

    return earliestArrival - tripDuration;
  }

  export function getEarliestArrival(tripId: number): number {
    /* return minutes */

    const firstTrip = TripUtils.get(tripId);

    const direction = TripDirectionEntity.FindDirectionById(
      firstTrip.tripDirectionId
    ).type;

    // TODO: Fix
    // ! Carreful here TripDirectionEnum.coming correspond to
    // ! startHourGoing
    if (direction == TripDirectionEnum.coming) {
      return (
        (firstTrip.schools[0].hours.startHourGoing?.hour as number) * 60 +
        (firstTrip.schools[0].hours.startHourGoing?.minutes as number)
      );
    } else {
      return (
        (firstTrip.schools[0].hours.startHourComing?.hour as number) * 60 +
        (firstTrip.schools[0].hours.startHourComing?.minutes as number)
      );
    }
  }

  export function getLatestArrival(tripId: number): number {
    /* return minutes */

    const firstTrip = TripUtils.get(tripId);

    const direction = TripDirectionEntity.FindDirectionById(
      firstTrip.tripDirectionId
    ).type;

    // TODO: Fix
    // ! Carreful here TripDirectionEnum.coming correspond to
    // ! startHourGoing
    if (direction == TripDirectionEnum.coming) {
      return (
        (firstTrip.schools[0].hours.endHourGoing?.hour as number) * 60 +
        (firstTrip.schools[0].hours.endHourGoing?.minutes as number)
      );
    } else {
      return (
        (firstTrip.schools[0].hours.endHourComing?.hour as number) * 60 +
        (firstTrip.schools[0].hours.endHourComing?.minutes as number)
      );
    }
  }

  export function getHlpDuration(
    serviceTripIds: number[],
    serviceTripsOrdered: ServiceTripOrderedType[],
    serviceTripIndex: number
  ): number {
    /*
    Return duration between :
    - start of source trip (in serviceTrips)
    - end of target trip (in serviceTripsOrdered)
    
    Return minutes
    */

    const idPreviousTrip = (
      serviceTripsOrdered.at(-1) as ServiceTripOrderedType
    ).tripId;
    const idActualTrip = serviceTripIds[serviceTripIndex];

    return hlpMatrix()[idActualTrip][idPreviousTrip];
  }

  export function removeTrip(
    services: ServiceType[],
    tripId: number
  ): ServiceType[] {
    const serviceToChange = services.filter(
      (service) => service.id == selectedService()
    )[0];
    const index = services.indexOf(serviceToChange);
    serviceToChange.tripIds = serviceToChange.tripIds.filter(
      (_tripId) => _tripId != tripId
    );

    services.splice(index, 1, serviceToChange);

    return services;
  }

  export function addService(services: ServiceType[]): ServiceType[] {
    const ids = services.map((service) => service.id);

    if (ids.length == 0) ids.push(0);
    else ids.sort((a, b) => a - b);

    const newService: ServiceType = {
      // Temporary serviceId only use locally during modification
      id: (ids.at(-1) as number) + 1,
      // TODO: Do not use raw value
      serviceGroupId: 1,
      name: "default name",
      tripIds: [],
      serviceTripsOrdered: [],
    };

    services.push(newService);

    return services;
  }

  function isCase2ConditionComing(
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): boolean {
    /* Aller */
    return (
      tripDirection == TripDirectionEnum.going &&
      minTimeOfTimeRange <= earliestEndHour &&
      earliestEndHour <= maxTimeOfTimeRange
    );
  }

  function isCase2ConditionGoing(
    earliestDepartureHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): boolean {
    /* Retour */
    return (
      tripDirection == TripDirectionEnum.coming &&
      minTimeOfTimeRange <= earliestDepartureHour &&
      earliestDepartureHour <= maxTimeOfTimeRange
    );
  }

  function isCase2(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): boolean {
    return (
      isCase2ConditionComing(
        earliestEndHour,
        tripDirection,
        minTimeOfTimeRange,
        maxTimeOfTimeRange
      ) ||
      isCase2ConditionGoing(
        earliestDepartureHour,
        tripDirection,
        minTimeOfTimeRange,
        maxTimeOfTimeRange
      )
    );
  }

  export function checkIfOutsideRange(
    service: ServiceType,
    serviceTripIndex: number
  ): boolean {
    const tripId = service.serviceTripsOrdered[serviceTripIndex].tripId;
    const departureHour =
      service.serviceTripsOrdered[serviceTripIndex].startHour;
    const endHour = service.serviceTripsOrdered[serviceTripIndex].endHour;

    const tripDirection = TripDirectionEntity.FindDirectionById(
      TripUtils.get(tripId).tripDirectionId
    ).type;
    const minTimeOfTimeRange = ServiceGridUtils.getEarliestArrival(tripId);
    const maxTimeOfTimeRange = ServiceGridUtils.getLatestArrival(tripId);

    return !isCase2(
      departureHour,
      endHour,
      tripDirection,
      minTimeOfTimeRange,
      maxTimeOfTimeRange
    );
  }

  function isCase3ConditionComing(
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number
  ): boolean {
    /* Aller */
    return (
      tripDirection == TripDirectionEnum.going &&
      earliestEndHour < minTimeOfTimeRange
    );
  }

  function isCase3ConditionGoing(
    earliestDepartureHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number
  ): boolean {
    /* Retour */
    return (
      tripDirection == TripDirectionEnum.coming &&
      earliestDepartureHour < minTimeOfTimeRange
    );
  }

  function isCase3(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number
  ): boolean {
    return (
      isCase3ConditionComing(
        earliestEndHour,
        tripDirection,
        minTimeOfTimeRange
      ) ||
      isCase3ConditionGoing(
        earliestDepartureHour,
        tripDirection,
        minTimeOfTimeRange
      )
    );
  }

  function isCase4ConditionComing(
    tripDirection: TripDirectionEnum,
    earliestEndHour: number,
    maxTimeOfTimeRange: number
  ): boolean {
    /* Aller */
    return (
      tripDirection == TripDirectionEnum.going &&
      earliestEndHour > maxTimeOfTimeRange
    );
  }

  function isCase4ConditionGoing(
    tripDirection: TripDirectionEnum,
    earliestDepartureHour: number,
    maxTimeOfTimeRange: number
  ): boolean {
    /* Retour */
    return (
      tripDirection == TripDirectionEnum.coming &&
      earliestDepartureHour > maxTimeOfTimeRange
    );
  }

  function isCase4(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    maxTimeOfTimeRange: number
  ): boolean {
    return (
      isCase4ConditionComing(
        tripDirection,
        earliestEndHour,
        maxTimeOfTimeRange
      ) ||
      isCase4ConditionGoing(
        tripDirection,
        earliestDepartureHour,
        maxTimeOfTimeRange
      )
    );
  }

  enum CaseEnum {
    case1,
    case2,
    case3,
    case4,
  }

  function getCaseNumber(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): CaseEnum | void {
    if (
      isCase2(
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
    /* Used only in case4 */

    return (
      // * Si pas de waitingTime => ajouter à la fin en orange
      !waitingTimes.some((waitingTime) => waitingTime > 0) ||
      // * Si waiting time pas dans la range => ajouter à la fin en orange
      // ! Si pls waitingTime ?
      !isCase2(
        _earliestDepartureHour,
        _earliestArrivalHour,
        tripDirection,
        minTimeOfTimeRange,
        maxTimeOfTimeRange
      ) ||
      // * Si waitingTimeDuration < hlp + trip duration => ajouter à la fin en orange
      waitingTimeDuration < newHlp + tripDuration
    );
  }
  // TODO: Refactor and clean
  export function getUpdatedServices(
    _services: ServiceType[]
  ): ServiceType[] | void {
    for (const service of _services) {
      service.serviceTripsOrdered = [];

      for (const serviceTripIndex of [
        ...Array(service.tripIds.length).keys(),
      ]) {
        const tripId = service.tripIds[serviceTripIndex];
        const tripDuration = ServiceGridUtils.getTripDuration(tripId);
        const tripDirection = TripDirectionEntity.FindDirectionById(
          TripUtils.get(tripId).tripDirectionId
        ).type;
        const minTimeOfTimeRange = ServiceGridUtils.getEarliestArrival(tripId);

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

        /*
        Computation for hlp, earliestEndHour, earliestDepartureHour uses 
        the last serviceTrips of serviceTripsOrdered as the previous serviceTrip
        */
        const hlp = ServiceGridUtils.getHlpDuration(
          service.tripIds,
          service.serviceTripsOrdered,
          serviceTripIndex
        );

        const maxTimeOfTimeRange = ServiceGridUtils.getLatestArrival(tripId);

        const earliestEndHour =
          (service.serviceTripsOrdered.at(-1) as ServiceTripOrderedType)
            .endHour +
          hlp +
          tripDuration;

        const earliestDepartureHour =
          (service.serviceTripsOrdered.at(-1) as ServiceTripOrderedType)
            .endHour + hlp;

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
            // TODO: Clean and refactor
            const waitingTimes = service.serviceTripsOrdered.map(
              (serviceTrip) => serviceTrip.waitingTime
            );
            const waitingTimeDuration = waitingTimes.filter(
              (waitingTime) => waitingTime > 0
            )[0];
            console.log("waitingTimeDuration", waitingTimeDuration);
            if (!waitingTimeDuration) {
              // TODO: Refactor
              service.serviceTripsOrdered.push({
                tripId,
                hlp,
                endHour: earliestEndHour,
                waitingTime: 0,
                startHour: earliestEndHour - tripDuration,
              });
              continue;
            }

            const indexOfWaitingTime =
              waitingTimes.indexOf(waitingTimeDuration);

            const waitingTimeStart =
              service.serviceTripsOrdered[indexOfWaitingTime - 1].endHour;

            const newHlp =
              hlpMatrix()[tripId][
                service.serviceTripsOrdered[indexOfWaitingTime].tripId
              ];

            const _earliestDepartureHour = waitingTimeStart + hlp;
            const _earliestArrivalHour = waitingTimeStart + hlp + tripDuration;

            // if (
            //   // * Si pas de waitingTime => ajouter à la fin en orange
            //   !waitingTimes.some((waitingTime) => waitingTime > 0) ||
            //   // * Si waiting time pas dans la range => ajouter à la fin en orange
            //   // ! Si pls waitingTime ?
            //   !isCase2(
            //     _earliestDepartureHour,
            //     _earliestArrivalHour,
            //     tripDirection,
            //     minTimeOfTimeRange,
            //     maxTimeOfTimeRange
            //   ) ||
            //   // * Si waitingTimeDuration < hlp + trip duration => ajouter à la fin en orange
            //   waitingTimeDuration < newHlp + tripDuration
            // ) {
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
              // TODO: Refactor
              service.serviceTripsOrdered.push({
                tripId,
                hlp,
                endHour: earliestEndHour,
                waitingTime: 0,
                startHour: earliestEndHour - tripDuration,
              });
              continue;
            }

            // if (
            //   !isCase2(
            //     _earliestDepartureHour,
            //     _earliestArrivalHour,
            //     tripDirection,
            //     minTimeOfTimeRange,
            //     maxTimeOfTimeRange
            //   )
            // ) {
            //   // TODO: Refactor
            //   service.serviceTripsOrdered.push({
            //     tripId,
            //     hlp,
            //     endHour: earliestEndHour,
            //     waitingTime: 0,
            //     startHour: earliestEndHour - tripDuration,
            //   });
            //   continue;
            // }
            // * Si waitingTimeDuration < hlp + trip duration => ajouter à la fin en orange
            // if (waitingTimeDuration < newHlp + tripDuration) {
            //   // TODO: Refactor
            //   service.serviceTripsOrdered.push({
            //     tripId,
            //     hlp,
            //     endHour: earliestEndHour,
            //     waitingTime: 0,
            //     startHour: earliestEndHour - tripDuration,
            //   });
            //   continue;
            // }
            // * Sinon placer dans la waitingTime au plus proche de la timeRange
            // TODO: => Vérifier que tout les autre cas déjà tester avant !

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
            continue;

          // TODO: Delete
          default:
            console.log(
              "WIP: Cette course ne peut pas être ajouté a ce service pour le moment"
            );
            return;
        }

        // Case 4 : Earliest arrival or departure after time range
        // TODO: Remove useless condition, it's the "else" case !?
        // if (case4ConditionComing() || case4ConditionGoing()) {
        // Décaler d'un cran et voir si ça passe
        // si ça passe (dans la range) voir si l'elt(s) décalé passe aussi
        // si oui c'est bon sinon continuer
        //
        // décaler de 2 crans
        // ...
        //
        // SI plus de décalage possible ajouter en fin de service
      }
      // console.log("service", service);
    }
    return _services;
  }
}
