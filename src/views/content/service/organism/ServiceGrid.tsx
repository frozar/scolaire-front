import { For, JSXElement, createEffect, createSignal, onMount } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridTop } from "../molecule/ServiceGridTop";
import { ServiceGridLine } from "./ServiceGridLine";
import { refScroll, services } from "./Services";

export const zoomLevels = [1, 3, 5, 8];

export const [zoom, setZoom] = createSignal(5);

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

  createEffect(() => {
    console.log("zoom =>", zoom());
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
