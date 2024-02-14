import { GradeEntity } from "../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { TripPointType } from "../_entities/trip.entity";
import { zoom } from "../views/content/service/organism/ServiceGrid";
import {
  ServiceTripType,
  ServiceType,
  services,
} from "../views/content/service/organism/Services";
import {
  hlpMatrix,
  selectedService,
} from "../views/content/service/template/ServiceTemplate";
import { BusServiceUtils } from "./busService.utils";
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

  export function getTripWidth(tripId: number): string {
    return (
      Math.round(
        ((TripUtils.get(tripId).metrics?.duration as number) / 60) * zoom()
      ) + "px"
    );
  }

  export function getStartStopName(tripId: number): string {
    return TripUtils.get(tripId).tripPoints[0].name;
  }

  export function getEndStopName(tripId: number): string {
    return (TripUtils.get(tripId).tripPoints.at(-1) as TripPointType).name;
  }

  export function getServiceTripStartHourValue(
    i: number,
    serviceTrip: ServiceTripType,
    serviceId: number
  ): number {
    /* Return startHourValue in minutes */

    if (i == 0) return ServiceGridUtils.getEarliestStart(serviceTrip.tripId);

    const previousEndHour =
      BusServiceUtils.get(serviceId).serviceTrips[i - 1].endHour;

    return previousEndHour + serviceTrip.hlp;
  }

  export function getServiceTripStartHour(
    i: number,
    serviceTrip: ServiceTripType,
    serviceId: number
  ): string {
    const startHour = ServiceGridUtils.getServiceTripStartHourValue(
      i,
      serviceTrip,
      serviceId
    );

    return ServiceGridUtils.getStringHourFormatFromMinutes(startHour);
  }

  export function updateAndGetServiceEndHour(
    i: number,
    serviceTrip: ServiceTripType,
    serviceId: number
  ): string {
    if (i == 0) {
      const endHour = ServiceGridUtils.getEarliestArrival(serviceTrip.tripId);

      const endHourToDisplay =
        ServiceGridUtils.getStringHourFormatFromMinutes(endHour);

      // To avoid infinite loop
      if (endHour == serviceTrip.endHour) return endHourToDisplay;

      // Save value in services()
      BusServiceUtils.updateEndHour(serviceId, serviceTrip.tripId, endHour);
      return endHourToDisplay;
    } else {
      const startHour = ServiceGridUtils.getServiceTripStartHourValue(
        i,
        serviceTrip,
        serviceId
      );

      const trip = TripUtils.get(serviceTrip.tripId);

      const duration = Math.round((trip.metrics?.duration as number) / 60);

      const endHour = startHour + duration;

      const endHourToDisplay =
        ServiceGridUtils.getStringHourFormatFromMinutes(endHour);

      // To avoid infinite loop
      if (endHour == serviceTrip.endHour) return endHourToDisplay;

      // Save value in services()
      BusServiceUtils.updateEndHour(serviceId, serviceTrip.tripId, endHour);

      return endHourToDisplay;
    }
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

  export function updateAndGetHlpWidth(
    serviceTrip: ServiceTripType,
    serviceId: number,
    i: number
  ): string {
    // hlpMatrix() is setted asynchronously
    if (Object.keys(hlpMatrix()).length == 0) return "0px";

    const serviceTrips = BusServiceUtils.get(serviceId).serviceTrips;
    const idPreviousTrip = serviceTrips[i - 1].tripId;
    const idActualTrip = serviceTrips[i].tripId;

    const hlpDuration = hlpMatrix()[idActualTrip][idPreviousTrip];

    // Save in services()
    if (hlpDuration != serviceTrip.hlp)
      BusServiceUtils.updateHlp(serviceId, idActualTrip, hlpDuration);

    return String(hlpDuration * zoom()) + "px";
  }

  export function removeTrip(
    services: ServiceType[],
    tripId: number
  ): ServiceType[] {
    const serviceToChange = services.filter(
      (service) => service.id == selectedService()
    )[0];
    const index = services.indexOf(serviceToChange);
    serviceToChange.serviceTrips = serviceToChange.serviceTrips.filter(
      (serviceTrip) => serviceTrip.tripId != tripId
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
      serviceTrips: [],
    };

    services.push(newService);

    return services;
  }
}
