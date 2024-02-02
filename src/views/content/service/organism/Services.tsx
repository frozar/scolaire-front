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
const [services, setServices] = createSignal<ServiceType[]>([
  { id: 1, name: "service test", tripsIds: [], totalDuration: 0 },
]);

export function Services(): JSXElement {
  return (
    <div class="service">
      <ServiceList services={services()} />
      <ServiceGrid services={services()} />
    </div>
  );
}
