import { For, JSXElement } from "solid-js";
import { ServiceListItem } from "../molecule/ServiceListItem";
import "./ServiceList.css";
import { services } from "./Services";

export function ServiceList(): JSXElement {
  return (
    <div id="service-list">
      <div id="service-list-header">
        <div id="service-list-header-title">Liste de services</div>
      </div>

      <For each={services()}>
        {(service) => <ServiceListItem service={service} />}
      </For>
    </div>
  );
}
