import { JSXElement } from "solid-js";
import { DraggableTripsType } from "../organism/ServiceLeftBoardContent";
import "./ServiceTripCard.css";

export function ServiceTripCard(props: {
  trip: DraggableTripsType;
}): JSXElement {
  // TODO: Make more components
  return (
    <div class="service-trip-card">
      <div class="service-trip-card-left">
        <div>{props.trip.tripName}</div>
        <div>{props.trip.lineName}</div>
      </div>
      <div class="service-trip-card-middle">
        <div>Plage de départ</div>
        <div>--:-- | --:--</div>
      </div>
      <div class="service-trip-card-right">
        <div>{props.trip.duration}</div>
        <div>{props.trip.hlp}</div>
      </div>
    </div>
  );
}
