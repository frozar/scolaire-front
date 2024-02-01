import { JSXElement, createSignal } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

export type ServiceType = {
  id: number;
  name: string;
  totalDuration: number;
  tripsIds: number[];
};

const [services, setServices] = createSignal<ServiceType[]>([
  { id: 1, name: "service test", tripsIds: [], totalDuration: 0 },
]);

export function Services(): JSXElement {
  return (
    <div class="flex mt-20">
      <ServiceList services={services()} />
      <ServiceGrid services={services()} />
    </div>
  );
}
