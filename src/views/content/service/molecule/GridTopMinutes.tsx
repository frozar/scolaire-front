import { For, JSXElement, Show } from "solid-js";
import { GridTopMinuteTick } from "../atom/GridTopMinuteTick";
import { zoom } from "../organism/ServiceGrid";

import "./GridTopMinutes.css";

interface GridTopMinutesProps {
  width: string;
}

export function GridTopMinutes(props: GridTopMinutesProps): JSXElement {
  function hourWidth(): string {
    const width = (1440 * zoom()) / 24;
    return width + "px";
  }

  return (
    <div id="service-grid-top-minute" style={{ width: props.width }}>
      <For each={[...Array(24).keys()]}>
        {() => (
          <div class="service-grid-top-hour" style={{ width: hourWidth() }}>
            <Show when={zoom() >= 3}>
              <div class="flex flex-col">
                <div
                  class="service-grid-top-minute-displayed"
                  style={{ width: hourWidth() }}
                >
                  {/* 5 because tens of minutes from 10 to 50 displayed */}
                  <For each={[...Array(5).keys()]}>
                    {(i) => {
                      const minuteToDisplay = i + 1;
                      return <div>{minuteToDisplay + "0"}</div>;
                    }}
                  </For>
                </div>
                <GridTopMinuteTick />
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  );
}
