import { JSXElement, Show } from "solid-js";

import { ServiceGridHlp } from "../atom/ServiceGridHlp";
import { ServiceGridTripItem } from "../atom/ServiceGridTripItem";
import { ServiceTripType } from "../organism/Services";
import "./ServiceGridItem.css";

interface ServiceGridItemProps {
  serviceTrip: ServiceTripType;
  serviceId: number;
  i: number;
}

export function ServiceGridItem(props: ServiceGridItemProps): JSXElement {
  // TODO: Make itemTrip, itemHlp
  return (
    <div class="service-grid-item">
      <Show when={props.i != 0}>
        <ServiceGridHlp />
      </Show>
      <ServiceGridTripItem
        serviceId={props.serviceId}
        serviceTrip={props.serviceTrip}
        i={props.i}
      />
    </div>
  );
}
