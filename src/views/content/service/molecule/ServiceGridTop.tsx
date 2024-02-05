import { For, JSXElement } from "solid-js";
import "./ServiceGridTop.css";

interface ServiceGridTopProps {
  width: string;
}

export function ServiceGridTop(props: ServiceGridTopProps): JSXElement {
  return (
    <div id="service-grid-top">
      <For each={[...Array(24).keys()]}>
        {(i) => (
          <div class="bg-slate-400 border border-black border-y-0 border-l-0 border-x">
            {i}
          </div>
        )}
      </For>
    </div>
  );
}
