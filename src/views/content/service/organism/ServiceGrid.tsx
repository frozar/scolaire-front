import { For, JSXElement, createEffect, createSignal, on } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridTop } from "../molecule/ServiceGridTop";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGrid.css";
import { ServiceGridLine } from "./ServiceGridLine";
import { services } from "./Services";

export const [zoom, setZoom] = createSignal(8);

export function ServiceGrid(): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  function gridWidthValue(): string {
    return String(zoom() * 1440) + "px";
  }

  createEffect(
    on(services, () => {
      if (!selectedService()) return;

      ServiceGridUtils.scrollToServiceStart(ref());
    })
  );

  return (
    <div id="service-grid" ref={setRef}>
      <ServiceGridTop width={gridWidthValue()} />
      <For each={services()}>
        {(service, i) => {
          return <ServiceGridLine i={i()} width={gridWidthValue()} />;
        }}
      </For>
    </div>
  );
}
