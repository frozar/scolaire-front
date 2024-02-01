import { JSXElement } from "solid-js";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import "./ServiceTripCardLeft.css";

type ServiceTripCardLeftProps = {
  trip: DraggableTripType;
};

export function ServiceTripCardLeft(
  props: ServiceTripCardLeftProps
): JSXElement {
  return (
    <div class="service-trip-card-left">
      <div>{props.trip.tripName}</div>
      <div>{props.trip.lineName}</div>
    </div>
  );
}
