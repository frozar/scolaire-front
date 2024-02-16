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

  // TODO: Refactor and clean
  export function getUpdatedServices(services: ServiceType[]): ServiceType[] {
    for (const service of services) {
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

        // Case 2 : Earliest arrival or departure in the time range
        function case2ConditionComing(): boolean {
          return (
            // ! Aller
            tripDirection == TripDirectionEnum.going &&
            minTimeOfTimeRange <= earliestEndHour &&
            earliestEndHour <= maxTimeOfTimeRange
          );
        }

        function case2ConditionGoing(): boolean {
          return (
            // ! Retour
            tripDirection == TripDirectionEnum.coming &&
            minTimeOfTimeRange <= earliestDepartureHour &&
            earliestDepartureHour <= maxTimeOfTimeRange
          );
        }

        if (case2ConditionComing() || case2ConditionGoing()) {
          service.serviceTripsOrdered.push({
            tripId,
            hlp,
            endHour: earliestEndHour,
            waitingTime: 0,
            startHour: earliestEndHour - tripDuration,
          });
        }

        // Case 3 : Earliest arrival or departure before time range
        function case3ConditionComing(): boolean {
          return (
            // ! Aller
            tripDirection == TripDirectionEnum.going &&
            earliestEndHour < minTimeOfTimeRange
          );
        }

        function case3ConditionGoing(): boolean {
          return (
            // ! Retour
            tripDirection == TripDirectionEnum.coming &&
            earliestDepartureHour < minTimeOfTimeRange
          );
        }

        if (case3ConditionComing() || case3ConditionGoing()) {
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
        }

        // Case 4 : Earliest arrival or departure after time range
      }
      console.log("service", service);
    }

    return services;
  }
}
