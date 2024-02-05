import { For, JSXElement } from "solid-js";
import { zoom } from "../organism/ServiceGrid";
import "./ServiceGridTop.css";

interface ServiceGridTopProps {
  width: string;
}

export function ServiceGridTop(props: ServiceGridTopProps): JSXElement {
  function getWidth(): string {
    const width = (1440 * zoom()) / 24;
    return width + "px";
  }
  return (
    <div id="service-grid-top" style={{ width: props.width }}>
      <For each={[...Array(24).keys()]}>
        {(i) => (
          <div
            class="bg-slate-400 border border-black border-y-0 border-l-0 border-x"
            style={{ width: getWidth() }}
          >
            {i}
          </div>
        )}
      </For>
    </div>
  );
}
