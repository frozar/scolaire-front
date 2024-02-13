import {
  ServiceType,
  services,
} from "../views/content/service/organism/Services";

export namespace BusServiceUtils {
  export function get(serviceId: number): ServiceType {
    return services().filter((service) => service.id == serviceId)[0];
  }
}
