import { JSXElement } from "solid-js";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";

import { ClockIcon } from "../../../../icons/ClockIcon";
import "./ServiceTripCardRight.css";

interface ServiceTripCardRightProps {
  trip: DraggableTripType;
}

export function ServiceTripCardRight(
  props: ServiceTripCardRightProps
): JSXElement {
  function secondsToMinutes(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    return hours.toString() + ":" + minutes.toString();
  }

  return (
    <div class="service-trip-card-right">
      <div class="service-trip-card-right-item">
        <ClockIcon />
        {secondsToMinutes(props.trip.duration)}
      </div>
      <div class="service-trip-card-right-item">
        <p class="service-trip-card-right-hlp">hlp</p>
        {secondsToMinutes(600)}
      </div>
    </div>
  );
}
