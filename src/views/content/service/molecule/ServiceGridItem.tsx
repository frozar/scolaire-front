import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceTripType } from "../organism/Services";
import "./ServiceGridItem.css";

interface ServiceGridItemProps {
  serviceTrip: ServiceTripType;
  i: number;
}

export function ServiceGridItem(props: ServiceGridItemProps): JSXElement {
  // TODO: Make itemTrip, itemHlp
  return (
    <div class="service-grid-item">
      <div
        class="service-grid-item-trip"
        style={{
          width: ServiceGridUtils.getTripWidth(props.serviceTrip.tripId),
        }}
      >
        <div class="service-grid-item-trip-name">
          {TripUtils.get(props.serviceTrip.tripId).name}
        </div>
        <div class="absolute text-xs -rotate-45 -bottom-6 -left-4">
          {ServiceGridUtils.getServiceTripStartHour(props.i, props.serviceTrip)}
        </div>
        <div class="absolute text-xs -rotate-45 -bottom-6 -right-4">
          {ServiceGridUtils.getServiceEndHour(props.i, props.serviceTrip)}
        </div>
      </div>
      <div
        class="service-grid-item-hlp"
        style={{ width: ServiceGridUtils.getHlpWidth() }}
      />
    </div>
  );
}
