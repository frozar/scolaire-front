import { For, JSXElement, createSignal } from "solid-js";
import { ServiceGridTop } from "../molecule/ServiceGridTop";
import "./ServiceGrid.css";
import { ServiceGridLine } from "./ServiceGridLine";
import { services } from "./Services";

export const [zoom, setZoom] = createSignal(8);

export function ServiceGrid(): JSXElement {
  function gridWidthValue(): string {
    return String(zoom() * 1440) + "px";
  }

  return (
    <div id="service-grid">
      <ServiceGridTop width={gridWidthValue()} />
      <For each={services()}>
        {(service, i) => {
          return <ServiceGridLine i={i()} width={gridWidthValue()} />;
        }}
      </For>
    </div>
  );
}
