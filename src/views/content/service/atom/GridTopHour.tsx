import { For, JSXElement } from "solid-js";
import { zoom } from "../organism/ServiceGrid";

import "./GridTopHour.css";

export function GridTopHour(): JSXElement {
  // TODO: Refactor
  function gridWidth(): string {
    const width = 1440 * zoom();
    return width + "px";
  }
  const hourDisplayedWidth = 40;
  function hourDisplayedMarginX(): number {
    const value = (1440 * zoom()) / 24;
    return value;
  }
  return (
    <div
      class="service-grid-list-hour-displayed"
      style={{ width: gridWidth() }}
    >
      <For each={[...Array(23).keys()]}>
        {(i) => (
          <div
            class="service-grid-hour-displayed"
            style={{
              width: hourDisplayedWidth + "px",
              "margin-left":
                i == 0
                  ? String(hourDisplayedMarginX() - hourDisplayedWidth / 2) +
                    "px"
                  : String(hourDisplayedMarginX() - hourDisplayedWidth) + "px",
            }}
          >
            {i + 1}
          </div>
        )}
      </For>
    </div>
  );
}
