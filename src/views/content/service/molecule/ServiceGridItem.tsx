import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

import { zoom } from "../organism/ServiceGrid";
import "./ServiceGridItem.css";

interface ServiceGridItemProps {
  tripId: number;
  i: number;
}

export function ServiceGridItem(props: ServiceGridItemProps): JSXElement {
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

  // function startHour(): string {
  //   if (props.i == 0) {
  //   }
  // }

  // function endHour(): string {

  // }

  // TODO: Make itemTrip, itemHlp and itemHalt components
  return (
    <div class="service-grid-item">
      <div class="service-grid-item-trip" style={{ width: tripWidth() }}>
        <div class="service-grid-item-trip-name">
          {TripUtils.get(props.tripId).name}
        </div>
        <div class="absolute text-xs -rotate-45 -bottom-6 -left-4">05:00</div>
        <div class="absolute text-xs -rotate-45 -bottom-6 -right-4">05:00</div>
      </div>
      <div class="service-grid-item-hlp" style={{ width: hlpWidth() }} />
    </div>
  );
}
