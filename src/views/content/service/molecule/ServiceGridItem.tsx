import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

import { zoom } from "../organism/ServiceGrid";
import "./ServiceGridItem.css";

// TODO: Make components
export function ServiceGridItem(props: { tripId: number }): JSXElement {
  function width() {
    return (
      Math.round(
        ((TripUtils.get(props.tripId).metrics?.duration as number) / 60) *
          zoom()
      ) + "px"
    );
  }

  return (
    <div class="service-grid-item">
      <div class="service-grid-item-trip" style={{ width: width() }}>
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
