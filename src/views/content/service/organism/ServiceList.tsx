import { For, JSXElement } from "solid-js";
import { ServiceType } from "./Services";

interface ServiceListProps {
  services: ServiceType[];
}

export function ServiceList(props: ServiceListProps): JSXElement {
  return (
    <div class="w-52 border border-l-0 border-y-0 ">
      <div />
      <For each={props.services}>{(service) => <div>{service.name}</div>}</For>
    </div>
  );
}
