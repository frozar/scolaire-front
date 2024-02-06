import { JSXElement, createSignal } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

import { ServiceGridZoomButtons } from "../molecule/ServiceGridZoomButtons";
import "./Service.css";

export type ServiceType = {
  id: number;
  name: string;
  totalDuration: number;
  serviceTrips: ServiceTripType[];
};

export type ServiceTripType = {
  tripId: number;
  hlp: number; // in minutes
  endHour: number; // in minutes
};

// export const [services, setServices] = createSignal<ServiceType[]>([
//   { id: 1, name: "service 1", tripsIds: [], totalDuration: 0 },
//   { id: 2, name: "service 2", tripsIds: [], totalDuration: 0 },
// ]);

export const [services, setServices] = createSignal<ServiceType[]>([
  { id: 1, name: "service 1", serviceTrips: [], totalDuration: 0 },
  { id: 2, name: "service 2", serviceTrips: [], totalDuration: 0 },
]);

export function Services(): JSXElement {
  return (
    <div class="flex flex-col overflow-auto">
      <div>
        <ServiceGridZoomButtons />
        {/* TODO: Make a component containing "validate" and "cancel" btns */}
      </div>
      <div class="service">
        <ServiceList />
        <ServiceGrid />
      </div>
    </div>
  );
}
