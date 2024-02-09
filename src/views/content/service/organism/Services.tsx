import _ from "lodash";
import { JSXElement, Show, createSignal, onMount } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

import { ServiceGridModificationButtons } from "../molecule/ServiceGridModificationButtons";
import { ServiceGridZoomButtons } from "../molecule/ServiceGridZoomButtons";
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
  onMount(() => {
    setServicesBeforeModification(_.cloneDeep(services()));
  });

  return (
    <div class="flex flex-col overflow-auto">
      <div>
        <ServiceGridZoomButtons />

        <Show when={!_.isEqual(servicesBeforeModification(), services())}>
          <ServiceGridModificationButtons />
        </Show>
      </div>

      <div class="service">
        <ServiceList />
        <ServiceGrid />
      </div>
    </div>
  );
}
