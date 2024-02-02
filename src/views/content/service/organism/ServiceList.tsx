import { For, JSXElement } from "solid-js";
import { ServiceType } from "./Services";

import "./ServiceList.css";

interface ServiceListProps {
  services: ServiceType[];
}

export function ServiceList(props: ServiceListProps): JSXElement {
  return (
    <div id="service-list">
      <For each={props.services}>{(service) => <div>{service.name}</div>}</For>
    </div>
  );
}
