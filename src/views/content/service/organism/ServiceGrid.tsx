import { For, JSXElement, createSignal } from "solid-js";
import "./ServiceGrid.css";
import { ServiceGridLine } from "./ServiceGridLine";
import { services } from "./Services";

export const [zoom, setZoom] = createSignal(10);

export function ServiceGrid(): JSXElement {
  function gridWidthValue(): string {
    return String(zoom() * 1440) + "px";
  }

  return (
    <div id="service-grid" style={{ width: gridWidthValue() }}>
      <div id="service-grid-top" style={{ width: gridWidthValue() }} />
      <For each={services()}>
        {(service, i) => {
          return <ServiceGridLine i={i()} width={gridWidthValue()} />;
        }}
      </For>
    </div>
  );
}
