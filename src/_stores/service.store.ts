import { createSignal } from "solid-js";
import { ServiceType } from "../views/content/service/organism/Services";

const [getServices, setServices] = createSignal<ServiceType[]>([]);

export namespace ServiceStore {
  export function set(
    services: ServiceType[] | ((prev: ServiceType[]) => ServiceType[])
  ) {
    setServices(services);
  }

  export function get() {
    return getServices();
  }
}
