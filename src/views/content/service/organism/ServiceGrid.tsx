import { For, JSXElement, createSignal, onMount } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridTop } from "../molecule/ServiceGridTop";
import { ServiceGridLine } from "./ServiceGridLine";
import { refScroll, services } from "./Services";

export const [zoom, setZoom] = createSignal(8);

export function ServiceGrid(): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  function gridWidthValue(): string {
    return String(zoom() * 1440) + "px";
  }

  onMount(() => {
    ServiceGridUtils.changeScrollingDirection(refScroll(), ref());
  });

  return (
    <div ref={setRef}>
      <ServiceGridTop width={gridWidthValue()} />
      <For each={services()}>
        {(service, i) => {
          return (
            <ServiceGridLine serviceIndex={i()} width={gridWidthValue()} />
          );
        }}
      </For>
    </div>
  );
}
