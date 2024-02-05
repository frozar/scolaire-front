import { For, JSXElement } from "solid-js";
import { services } from "./Services";

import { ServiceGridItem } from "../molecule/ServiceGridItem";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridLine.css";

interface ServiceGridLineProps {
  i: number;
  width: string;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  return (
    <div
      class={"service-grid-line"}
      style={{ width: props.width }}
      classList={{ active: selectedService() == services()[props.i].id }}
    >
      <For each={services()[props.i].tripsIds}>
        {(tripId) => <ServiceGridItem tripId={tripId} />}
      </For>
    </div>
  );
}
