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
      <div class="flex gap-x-2">
        <ClockIcon />
        {secondsToMinutes(props.trip.duration)}
      </div>
      <div class="flex gap-x-2">
        <p class="text-green-base w-5">hlp</p>
        {secondsToMinutes(600)}
      </div>
    </div>
  );
}
