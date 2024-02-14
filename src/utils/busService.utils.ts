import { LatLng } from "leaflet";
import { getLines } from "../views/content/map/component/organism/BusLines";
import {
  ServiceType,
  services,
  setServices,
} from "../views/content/service/organism/Services";

export namespace BusServiceUtils {
  export function get(serviceId: number): ServiceType {
    return services().filter((service) => service.id == serviceId)[0];
  }
  export function updateServiceName(serviceId: number, newName: string): void {
    setServices((prev) => {
      const services = [...prev];

      const serviceToChange = BusServiceUtils.get(serviceId);
      const index = services.indexOf(serviceToChange);

      serviceToChange.name = newName;

      services.splice(index, 1, serviceToChange);

      return services;
    });
  }
  export function updateEndHour(
    serviceId: number,
    tripId: number,
    endHour: number
  ): void {
    setServices((prev) => {
      const services = [...prev];

      const serviceToChange = BusServiceUtils.get(serviceId);
      const index = services.indexOf(serviceToChange);

      serviceToChange.serviceTrips.forEach((serviceTrip) => {
        if (serviceTrip.tripId == tripId) serviceTrip.endHour = endHour;
      });

      services.splice(index, 1, serviceToChange);

      return services;
    });
  }

  export function updateHlp(
    serviceId: number,
    tripId: number,
    hlp: number
  ): void {
    setServices((prev) => {
      const services = [...prev];

      const serviceToChange = BusServiceUtils.get(serviceId);
      const index = services.indexOf(serviceToChange);

      serviceToChange.serviceTrips.forEach((serviceTrip) => {
        if (serviceTrip.tripId == tripId) serviceTrip.hlp = hlp;
      });

      services.splice(index, 1, serviceToChange);

      return services;
    });
  }

  export function addTrip(tripId: number, serviceId: number): void {
    setServices((prev) => {
      const services = [...prev];

      const serviceToChange = BusServiceUtils.get(serviceId);

      const index = services.indexOf(serviceToChange);

      serviceToChange.serviceTrips.push({
        tripId: tripId,
        // TODO: Do not setup these values ?
        hlp: 5,
        endHour: 0,
      });

      services.splice(index, 1, serviceToChange);

      return services;
    });
  }

  export function getStartAndEndTripLatLngs(): {
    latLngs: LatLng[];
    tripIds: number[];
  } {
    const latLngs = getLines()
      .flatMap((line) => line.trips)
      .flatMap((trips) => [trips.latLngs[0], trips.latLngs.at(-1) as L.LatLng]);

    const tripIds = getLines()
      .flatMap((line) => line.trips)
      .map((trip) => trip.id as number);

    return { latLngs, tripIds };
  }
}
