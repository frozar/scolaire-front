import { GradeEntity } from "../_entities/grade.entity";
import { zoom } from "../views/content/service/organism/ServiceGrid";
import {
  ServiceTripType,
  ServiceType,
  services,
} from "../views/content/service/organism/Services";
import { selectedService } from "../views/content/service/template/ServiceTemplate";
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

  export function getServiceTripStartHour(
    i: number,
    serviceTrip: ServiceTripType
  ): string {
    if (i == 0) {
      const endHour = serviceTrip.endHour;

      const duration = Math.round(
        (TripUtils.get(serviceTrip.tripId).metrics?.duration as number) / 60
      );

      const startHour = endHour - duration;

      const hour = Math.trunc(startHour / 60);
      const minutes = startHour % 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
      // TODO
    } else return "--:--";
  }

  export function getServiceEndHour(
    i: number,
    serviceTrip: ServiceTripType
  ): string {
    if (i == 0) {
      const hour = Math.round(serviceTrip.endHour / 60);
      const minutes = (serviceTrip.endHour % 60) * 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
      // TODO
    } else return "--:--";
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
    // ! Laisser valeur undefined !!
    // ! doit être calculé au niveau de gridItem => plus imple si modif (reactif !!!!)
    let endHour;
    if (serviceToChange.serviceTrips.length == 0) {
      // get eraliest arrival and transform in seconds
      const trip = TripUtils.get(tripId);
      endHour =
        (trip.schools[0].hours.startHourComing?.hour as number) * 60 +
        (trip.schools[0].hours.startHourComing?.minutes as number);
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
