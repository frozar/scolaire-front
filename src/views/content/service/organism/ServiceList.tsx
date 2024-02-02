import { For, JSXElement } from "solid-js";
import { ServiceListItem } from "../molecule/ServiceListItem";
import "./ServiceList.css";
import { ServiceType } from "./Services";

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
        {(service) => <ServiceListItem service={service} />}
      </For>
    </div>
  );
}
