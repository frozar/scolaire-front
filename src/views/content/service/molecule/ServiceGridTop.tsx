import { For, JSXElement } from "solid-js";
import { zoom } from "../organism/ServiceGrid";
import "./ServiceGridTop.css";

interface ServiceGridTopProps {
  width: string;
}

export function ServiceGridTop(props: ServiceGridTopProps): JSXElement {
  function hourWidth(): string {
    const width = (1440 * zoom()) / 24;
    return width + "px";
  }

  function minuteWidth(): string {
    const width = (1440 * zoom()) / 24 / 6;
    return width + "px";
  }
  return (
    <div id="service-grid-top" style={{ width: props.width }}>
      <For each={[...Array(24).keys()]}>
        {(i) => (
          <div
            class="flex items-end bg-slate-400 border border-black border-y-0 border-l-0 border-x"
            style={{ width: hourWidth() }}
          >
            {i}
            {/* <div class="flex"> */}
            <div class="flex justify-around" style={{ width: hourWidth() }}>
              <For each={[...Array(5).keys()]}>
                {(i) => {
                  const test = i + 1;
                  return <div>{test + "0"}</div>;
                }}
              </For>
            </div>
            <For each={[...Array(5).keys()]}>
              {(i) => (
                <div
                  class="h-1 border border-black border-y-0 border-l-0 border-r-1"
                  style={{ width: minuteWidth() }}
                />
              )}
            </For>
            {/* </div> */}
          </div>
        )}
      </For>
    </div>
  );
}
