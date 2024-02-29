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
    <div class="service-grid-item">
      <Show when={props.serviceTrip.waitingTime > 0}>
        <ServiceGridWaitingItem
          width={ServiceGridUtils.widthCssValue(props.serviceTrip.waitingTime)}
        />
      </Show>

      <Show when={props.hlpWidth > 0}>
        <ServiceGridHlp width={props.hlpWidth} />
      </Show>

      <ServiceGridTripItem
        serviceId={props.serviceId}
        serviceTrip={props.serviceTrip}
        serviceTripIndex={props.serviceTripIndex}
        serviceTripWidth={ServiceGridUtils.getTripDuration(
          props.serviceTrip.tripId
        )}
        outsideScheduleRange={props.outsideScheduleRange}
      />
    </div>
  );
}
