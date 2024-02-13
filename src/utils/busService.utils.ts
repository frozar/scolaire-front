import {
  ServiceType,
  services,
  setServices,
} from "../views/content/service/organism/Services";

export namespace BusServiceUtils {
  export function get(serviceId: number): ServiceType {
    return services().filter((service) => service.id == serviceId)[0];
  }

  export function updateEndHour(
    serviceId: number,
    tripId: number,
    endHour: number
  ): void {
    setServices((prev) => {
      const services = [...prev];

      const serviceToChange = services.filter(
        (service) => service.id == serviceId
      )[0];
      const index = services.indexOf(serviceToChange);

      serviceToChange.serviceTrips.forEach((serviceTrip) => {
        if (serviceTrip.tripId == tripId) serviceTrip.endHour = endHour;
      });

      services.splice(index, 1, serviceToChange);

      return services;
    });
  }
}
