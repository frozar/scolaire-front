import { For, JSXElement } from "solid-js";
import { ServiceGridLine } from "./ServiceGridLine";
import { ServiceType } from "./Services";

import "./ServiceGrid.css";

interface ServiceGridProps {
  services: ServiceType[];
}

export function ServiceGrid(props: ServiceGridProps): JSXElement {
  return (
    <div>
      <div id="service-grid-top" />
      <For each={props.services}>
        {(service) => <ServiceGridLine service={service} />}
      </For>
    </div>
  );
}
