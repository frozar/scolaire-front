import { JSXElement, createSignal } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

import "./Service.css";

export type ServiceType = {
  id: number;
  name: string;
  totalDuration: number;
  tripsIds: number[];
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const [services, setServices] = createSignal<ServiceType[]>([
  { id: 1, name: "service 1", tripsIds: [], totalDuration: 0 },
  { id: 2, name: "service 2", tripsIds: [], totalDuration: 0 },
]);

export function Services(): JSXElement {
  return (
    <div class="service">
      <ServiceList services={services()} />
      <ServiceGrid services={services()} />
    </div>
  );
}
