import { For, JSXElement } from "solid-js";
import { ServiceType } from "./Services";

import "./ServiceList.css";

interface ServiceListProps {
  services: ServiceType[];
}

export function ServiceList(props: ServiceListProps): JSXElement {
  return (
    <div id="service-list">
      <div id="service-list-header">
        <div id="service-list-header-title">Liste de services</div>
      </div>
      <For each={props.services}>
        {(service) => <div class="service-list-item">{service.name}</div>}
      </For>
    </div>
  );
}
