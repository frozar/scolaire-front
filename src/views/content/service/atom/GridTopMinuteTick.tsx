import { For } from "solid-js";
import { zoom } from "../organism/ServiceGrid";

import "./GridTopMinuteTick.css";

export function GridTopMinuteTick() {
  function minuteWidth(): string {
    const width = (1440 * zoom()) / 24 / 6;
    return width + "px";
  }
  return (
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
  );
}
