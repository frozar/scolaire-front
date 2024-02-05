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
          <div class="service-grid-top-hour" style={{ width: hourWidth() }}>
            {/* {i} */}
            <div class="flex flex-col">
              <div
                class="service-grid-top-minute-displayed"
                style={{ width: hourWidth() }}
              >
                <For each={[...Array(5).keys()]}>
                  {(i) => {
                    const minuteToDisplay = i + 1;
                    return <div>{minuteToDisplay + "0"}</div>;
                  }}
                </For>
              </div>
              <div class="flex">
                <For each={[...Array(5).keys()]}>
                  {() => (
                    <div
                      class="service-grid-top-minute-tick"
                      style={{ width: minuteWidth() }}
                    />
                  )}
                </For>
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
