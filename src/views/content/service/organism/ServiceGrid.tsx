import { For, JSXElement } from "solid-js";
import { ServiceGridLine } from "./ServiceGridLine";
import { ServiceType } from "./Services";

interface ServiceGridProps {
  services: ServiceType[];
}

export function ServiceGrid(props: ServiceGridProps): JSXElement {
  return (
    <div>
      <For each={props.services}>
        {(service) => <ServiceGridLine service={service} />}
      </For>
    </div>
  );
}
