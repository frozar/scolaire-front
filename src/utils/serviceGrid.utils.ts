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
import { selectedService } from "../views/content/service/template/ServiceTemplate";
import { BusServiceUtils } from "./service.utils";
import { TripUtils } from "./trip.utils";

export namespace ServiceGridUtils {
  export function scrollToServiceStart(ref: HTMLDivElement): void {
    /*
    Scroll to the beginning of the selected service when modified
    Only change position of scroll in axis x
    */

    const actualService = services().filter(
      (service) => service.id == selectedService()
    )[0];

    if (actualService.serviceTrips.length == 0) return;

    const endHour = actualService.serviceTrips[0].endHour;

    ref.scrollTo((endHour - 25) * zoom(), ref.scrollTop);
  }

  export function getTripWidth(tripId: number): string {
    return (
      Math.round(
        ((TripUtils.get(tripId).metrics?.duration as number) / 60) * zoom()
      ) + "px"
    );
  }

  export function getHlpWidth(): string {
    // TODO: Use real value
    return String(5 * zoom()) + "px";
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
    if (i == 0) {
      return ServiceGridUtils.getEarliestStart(serviceTrip.tripId);
    } else {
      const previousEndHour =
        BusServiceUtils.get(serviceId).serviceTrips[i - 1].endHour;

      // TODO: Use minutes as unit for hlp !
      const startHour = previousEndHour + serviceTrip.hlp / 60;

      return startHour;
    }
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

    // TODO: Refactor
    const hour = Math.trunc(startHour / 60);
    const minutes = startHour % 60;

    return GradeEntity.getStringFromHourFormat({ hour, minutes });
  }

  // export function getServiceEndHour(
  //   i: number,
  //   serviceTrip: ServiceTripType
  // ): string {
  //   if (i == 0) {
  //     const hour = Math.round(serviceTrip.endHour / 60);
  //     const minutes = (serviceTrip.endHour % 60) * 60;

  //     return GradeEntity.getStringFromHourFormat({ hour, minutes });
  //     // TODO: Utiliser getServiceTripStartHour()
  //     // ! Auquel ajouter le hlp et la duration
  //     // ! mettre à jour le service
  //     // ! retourner la bonne valeurs
  //   } else return "--:--";
  // }

  export function getServiceEndHour(
    i: number,
    serviceTrip: ServiceTripType,
    serviceId: number
  ): string {
    if (i == 0) {
      // TODO: Refactor
      const hour = Math.round(serviceTrip.endHour / 60);
      const minutes = (serviceTrip.endHour % 60) * 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
      // TODO: Utiliser getServiceTripStartHour()
      // ! Auquel ajouter le hlp et la duration
      // ! mettre à jour le service
      // ! retourner la bonne valeurs
    } else {
      const startHour = ServiceGridUtils.getServiceTripStartHourValue(
        i,
        serviceTrip,
        serviceId
      );

      const trip = TripUtils.get(serviceTrip.tripId);

      const duration = Math.round((trip.metrics?.duration as number) / 60);

      const endHour = startHour + serviceTrip.hlp / 60 + duration;

      // TODO: Refactor
      const hour = Math.round(endHour / 60);
      const minutes = (endHour % 60) * 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
    }
  }

  export function addTrip(
    services: ServiceType[],
    tripId: number
  ): ServiceType[] {
    const serviceToChange = services.filter(
      (service) => service.id == selectedService()
    )[0];
    const index = services.indexOf(serviceToChange);

    // TODO: Create getEarlyArrival() and put in TripUtils
    // TODO: Only do that if first trip
    let endHour;
    if (serviceToChange.serviceTrips.length == 0) {
      endHour = ServiceGridUtils.getEarliestArrival(tripId);
      // TODO:
    } else endHour = 0;
    serviceToChange.serviceTrips.push({
      tripId: tripId,
      hlp: 300,
      endHour,
    });

    services.splice(index, 1, serviceToChange);

    return services;
  }

  export function getEarliestStart(tripId: number): number {
    /* 
    return minutes
    */

    const firstTrip = TripUtils.get(tripId);

    const earliestArrival = ServiceGridUtils.getEarliestArrival(tripId);

    const tripDuration = Math.round(
      (firstTrip.metrics?.duration as number) / 60
    );

    return earliestArrival - tripDuration;
  }

  export function getEarliestArrival(tripId: number): number {
    /* 
    return minutes
    */
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
