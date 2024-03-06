import { JSXElement, Show } from "solid-js";

import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridHlp } from "../atom/ServiceGridHlp";
import { ServiceGridWaitingItem } from "../atom/ServiceGridWaitingItem";
import { ServiceTrip } from "../organism/Services";
import "./ServiceGridItem.css";
import { ServiceGridTripItem } from "./ServiceGridTripItem";

interface ServiceGridItemProps {
  serviceTripIndex: number;
  serviceTrip: ServiceTrip;
  serviceId: number;
  hlpWidth: number;
  outsideScheduleRange: boolean;
}

export function ServiceGridItem(props: ServiceGridItemProps): JSXElement {
  return (
    <div
      data-id={props.serviceTrip.tripId}
      class="service-grid-item items-center"
    >
      <Show when={props.serviceTrip.waitingTime > 0}>
        <ServiceGridWaitingItem
          width={ServiceGridUtils.widthCssValue(props.serviceTrip.waitingTime)}
        />
      </Show>

      <Show when={props.hlpWidth > 0}>
        <ServiceGridHlp width={props.hlpWidth} />
      </Show>
      {/*
    Drag and drop fix
      => do not show last fake trip
    
    Aim is to prevent :
      "solidjs" Failed to execute 'insertBefore' on 'Node': 
      The node before which the new node is to be inserted is not a child of this node.
    */}
      <Show when={props.serviceTrip.tripId != -1}>
        <ServiceGridTripItem
          serviceId={props.serviceId}
          serviceTrip={props.serviceTrip}
          serviceTripIndex={props.serviceTripIndex}
          serviceTripWidth={ServiceGridUtils.getTripDuration(
            props.serviceTrip.tripId
          )}
          outsideScheduleRange={props.outsideScheduleRange}
        />
      </Show>
    </div>
  );
}
