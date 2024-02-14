import _ from "lodash";
import { JSXElement, createEffect, createSignal, on, onMount } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridButtons } from "../molecule/ServiceGridButtons";
import { selectedService } from "../template/ServiceTemplate";
import "./Service.css";

export type ServiceType = {
  id: number;
  name: string;
  serviceGroupId: number;
  serviceTrips: ServiceTripType[];
};

export type ServiceTripType = {
  tripId: number;
  hlp: number; // in minutes
  endHour: number; // in minutes
};

export const [services, setServices] = createSignal<ServiceType[]>([]);
export const [servicesBeforeModification, setServicesBeforeModification] =
  createSignal<ServiceType[]>([]);

export function Services(): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  createEffect(
    on(services, () => {
      const selectedServiceId = selectedService();
      if (!selectedServiceId) return;

      ServiceGridUtils.scrollToServiceStart(ref(), selectedServiceId);
    })
  );

  onMount(() => {
    setServicesBeforeModification(_.cloneDeep(services()));

    const firstServiceId = services()[0].id;
    ServiceGridUtils.scrollToServiceStart(ref(), firstServiceId);
  });

  return (
    <div id="services">
      <ServiceGridButtons />

      <div id="services-displayed" ref={setRef}>
        <ServiceList />
        <ServiceGrid />
      </div>
    </div>
  );
}
