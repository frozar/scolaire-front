import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

import { zoom } from "../organism/ServiceGrid";
import "./ServiceGridItem.css";

export function ServiceGridItem(props: { tripId: number }): JSXElement {
  function tripWidth(): string {
    return (
      Math.round(
        ((TripUtils.get(props.tripId).metrics?.duration as number) / 60) *
          zoom()
      ) + "px"
    );
  }

  function hlpWidth(): string {
    // ! Temporary value of 10 minutes used
    return String(5 * zoom()) + "px";
  }

  // TODO: Make itemTrip, itemHlp and itemHalt components
  return (
    <div class="service-grid-item">
      <div class="service-grid-item-trip" style={{ width: tripWidth() }}>
        <div class="service-grid-item-trip-name">
          {TripUtils.get(props.tripId).name}
        </div>
      </div>
      <div class="service-grid-item-hlp" style={{ width: hlpWidth() }} />
    </div>
  );
}
