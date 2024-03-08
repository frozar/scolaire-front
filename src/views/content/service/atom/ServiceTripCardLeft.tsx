import { JSXElement } from "solid-js";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import "./ServiceTripCardLeft.css";

interface ServiceTripCardLeftProps {
  trip: DraggableTripType;
}

export function ServiceTripCardLeft(
  props: ServiceTripCardLeftProps
): JSXElement {
  return (
    <div class="service-trip-card-left">
      <p class="service-trip-card-left-trip">{props.trip.tripName}</p>
      <p class="service-trip-card-left-line">{props.trip.lineName}</p>
    </div>
  );
}
