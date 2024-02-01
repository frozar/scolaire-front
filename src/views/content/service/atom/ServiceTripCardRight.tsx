import { JSXElement } from "solid-js";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";

import "./ServiceTripCardRight.css";

type ServiceTripCardRightProps = {
  trip: DraggableTripType;
};

export function ServiceTripCardRight(
  props: ServiceTripCardRightProps
): JSXElement {
  return (
    <div class="service-trip-card-right">
      <div>{props.trip.duration}</div>
      <div>{props.trip.hlp}</div>
    </div>
  );
}
