import { GradeEntity } from "../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { TripPointType } from "../_entities/trip.entity";
import {
  zoom,
  zoomLevels,
} from "../views/content/service/organism/ServiceGrid";
import {
  ServiceType,
  services,
} from "../views/content/service/organism/Services";
import { hlpMatrix } from "../views/content/service/template/ServiceTemplate";
import { ServiceTripsUtils } from "./serviceTrips.utils";
import { TripUtils } from "./trip.utils";

export enum ZoomTypeEnum {
  in,
  out,
}

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
    if (actualService.serviceTrips.length == 0) return;

    const endHour = actualService.serviceTrips[0].endHour;

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

  export function adaptScrollPositionToZoom(
    ref: HTMLDivElement,
    zoomType: ZoomTypeEnum
  ): void {
    ref.style.scrollBehavior = "auto";

    const zoomIndex = zoomLevels.indexOf(zoom());

    const scrollPositionInMinutes =
      zoomType == ZoomTypeEnum.in
        ? ref.scrollLeft / zoomLevels[zoomIndex - 1]
        : ref.scrollLeft / zoomLevels[zoomIndex + 1];

    ref.scrollTo(scrollPositionInMinutes * zoom(), ref.scrollTop);

    ref.style.scrollBehavior = "smooth";
  }

  function getEarliestStart(tripId: number): number {
    /* return minutes */

    const firstTrip = TripUtils.get(tripId);
    const tripDuration = Math.round(
      (firstTrip?.metrics?.duration as number) / 60
    );

    const earliestArrival = ServiceGridUtils.getEarliestArrival(tripId);

    return earliestArrival - tripDuration;
  }

  export function firstDivWidth(serviceIndex: number): string {
    return (
      getEarliestStart(services()[serviceIndex].serviceTrips[0]?.tripId) *
        zoom() +
      "px"
    );
  }

  export function getTripDuration(tripId: number): number {
    /* Return minutes */
    return Math.round(
      (TripUtils.get(tripId)?.metrics?.duration as number) / 60
    );
  }

  export function getStartStopName(tripId: number): string {
    return TripUtils.get(tripId)?.tripPoints[0].name;
  }

  export function getEndStopName(tripId: number): string {
    return (TripUtils.get(tripId)?.tripPoints.at(-1) as TripPointType)?.name;
  }

  export function getStringHourFormatFromMinutes(totalMinutes: number): string {
    const hour = Math.trunc(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return GradeEntity.getStringFromHourFormat({ hour, minutes });
  }

  // TODO: Refactor with getLatestArrival()
  export function getEarliestArrival(tripId: number): number {
    /* return minutes */

    const firstTrip = TripUtils.get(tripId);

    const direction = TripDirectionEntity.FindDirectionById(
      firstTrip?.tripDirectionId
    ).type;

    // TODO: Fix
    // ! Carreful here TripDirectionEnum.coming correspond to
    // ! startHourGoing
    if (direction == TripDirectionEnum.coming) {
      return (
        (firstTrip?.schools[0].hours.startHourGoing?.hour as number) * 60 +
        (firstTrip?.schools[0].hours.startHourGoing?.minutes as number)
      );
    } else {
      return (
        (firstTrip?.schools[0].hours.startHourComing?.hour as number) * 60 +
        (firstTrip?.schools[0].hours.startHourComing?.minutes as number)
      );
    }
  }

  export function getLatestArrival(tripId: number): number {
    /* return minutes */

    const firstTrip = TripUtils.get(tripId);

    const direction = TripDirectionEntity.FindDirectionById(
      firstTrip?.tripDirectionId
    ).type;

    // TODO: Fix
    // ! Carreful here TripDirectionEnum.coming correspond to
    // ! startHourGoing
    if (direction == TripDirectionEnum.coming) {
      return (
        (firstTrip?.schools[0].hours.endHourGoing?.hour as number) * 60 +
        (firstTrip?.schools[0].hours.endHourGoing?.minutes as number)
      );
    } else {
      return (
        (firstTrip?.schools[0].hours.endHourComing?.hour as number) * 60 +
        (firstTrip?.schools[0].hours.endHourComing?.minutes as number)
      );
    }
  }

  export function getHlpDuration(
    serviceTripIds: number[],
    serviceTripIndex: number
  ): number {
    /*
    Return duration between :
    - start of source trip
    - end of target trip
    
    Return minutes
    */

    const idPreviousTrip = serviceTripIds[serviceTripIndex - 1];
    const idActualTrip = serviceTripIds[serviceTripIndex];

    return hlpMatrix()[idActualTrip][idPreviousTrip];
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
      serviceTrips: [],
    };

    services.push(newService);

    return services;
  }

  export function isOutsideRange(
    service: ServiceType,
    serviceTripIndex: number
  ): boolean {
    const tripId = service.serviceTrips[serviceTripIndex].tripId;
    const departureHour = service.serviceTrips[serviceTripIndex].startHour;
    const endHour = service.serviceTrips[serviceTripIndex].endHour;

    const tripDirection = TripDirectionEntity.FindDirectionById(
      TripUtils.get(tripId)?.tripDirectionId
    ).type;
    const minTimeOfTimeRange = ServiceGridUtils.getEarliestArrival(tripId);
    const maxTimeOfTimeRange = ServiceGridUtils.getLatestArrival(tripId);

    return !ServiceTripsUtils.isCase2(
      departureHour,
      endHour,
      tripDirection,
      minTimeOfTimeRange,
      maxTimeOfTimeRange
    );
  }
}
