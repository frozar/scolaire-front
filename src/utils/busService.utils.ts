import { LatLng } from "leaflet";
import {
  ServiceType,
  services,
  setServices,
} from "../views/content/service/organism/Services";
import { getLines } from "../_stores/line.store";

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
