import { For, JSXElement } from "solid-js";
import { ServiceTrip } from "../molecule/ServiceTrip";
import { ServiceType } from "./Services";

import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridLine.css";

interface ServiceGridLineProps {
  service: ServiceType;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  return (
    <div
      class="service-grid-line"
      classList={{ active: selectedService() == props.service.id }}
    >
      <For each={props.service.tripsIds}>
        {(tripId) => <ServiceTrip id={tripId} />}
      </For>
    </div>
  );
}
