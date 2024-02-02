import { For, JSXElement } from "solid-js";
import "./ServiceGrid.css";
import { ServiceGridLine } from "./ServiceGridLine";
import { services } from "./Services";

export function ServiceGrid(): JSXElement {
  return (
    <div>
      <div id="service-grid-top" />
      <For each={services()}>
        {(service, i) => {
          return <ServiceGridLine i={i()} />;
        }}
      </For>
    </div>
  );
}
