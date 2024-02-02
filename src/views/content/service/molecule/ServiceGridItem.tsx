import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

import "./ServiceGridItem.css";

// TODO: Make components
export function ServiceGridItem(props: { tripId: number }): JSXElement {
  return (
    <div class="service-grid-item">
      <div class="service-grid-item-trip">
        <div class="service-grid-item-trip-name">
          {TripUtils.get(props.tripId).name}
        </div>
      </div>
      <div class="service-grid-item-hlp" />
      <div class="service-grid-item-halt">
        <div class="service-grid-item-halt-element" />
      </div>
    </div>
  );
}
