import { For, JSXElement } from "solid-js";
import { services } from "./Services";

import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridLine.css";

interface ServiceGridLineProps {
  i: number;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  return (
    <div
      class="service-grid-line"
      classList={{ active: selectedService() == services()[props.i].id }}
    >
      <div>
        <For each={services()[props.i].tripsIds}>
          {(tripId) => <div>{tripId}</div>}
        </For>
      </div>
    </div>
  );
}
