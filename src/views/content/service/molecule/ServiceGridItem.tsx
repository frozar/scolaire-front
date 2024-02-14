import { JSXElement, Show } from "solid-js";

import { ServiceGridHlp } from "../atom/ServiceGridHlp";
import { ServiceTripType } from "../organism/Services";
import "./ServiceGridItem.css";
import { ServiceGridTripItem } from "./ServiceGridTripItem";

interface ServiceGridItemProps {
  serviceTrip: ServiceTripType;
  serviceId: number;
  i: number;
}

export function ServiceGridItem(props: ServiceGridItemProps): JSXElement {
  return (
    <div class="service-grid-item">
      <Show when={props.i != 0}>
        <ServiceGridHlp
          i={props.i}
          serviceId={props.serviceId}
          serviceTrip={props.serviceTrip}
        />
      </Show>

      <ServiceGridTripItem
        serviceId={props.serviceId}
        serviceTrip={props.serviceTrip}
        i={props.i}
      />
    </div>
  );
}
