import _ from "lodash";
import { JSXElement, createSignal, onMount } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

import { ServiceGridButtons } from "../molecule/ServiceGridButtons";
import { ServiceGridHeader } from "../molecule/ServiceGridHeader";
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
    <div id="services">
      <ServiceGridButtons />

      <ServiceGridHeader />

      <div id="services-displayed">
        <ServiceList />
        <ServiceGrid />
      </div>
    </div>
  );
}
