import { For, JSXElement } from "solid-js";
import { ServiceListAdd } from "../molecule/ServiceListAdd";
import { ServiceListItem } from "../molecule/ServiceListItem";
import "./ServiceList.css";
import { services } from "./Services";

export function ServiceList(): JSXElement {
  return (
    <div id="service-list">
      <For each={services()}>
        {(service) => <ServiceListItem service={service} />}
      </For>

      <ServiceListAdd />
    </div>
  );
}
