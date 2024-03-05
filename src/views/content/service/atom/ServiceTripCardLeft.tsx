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
      <p class="font-medium">{props.trip.tripName}</p>
      <p class="text-sm">{props.trip.lineName}</p>
    </div>
  );
}
