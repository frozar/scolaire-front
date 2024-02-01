import { JSXElement } from "solid-js";

import { createSortable } from "@thisbeyond/solid-dnd";

import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import "./ServiceTripCard.css";

export function ServiceTripCard(props: {
  trip: DraggableTripType;
}): JSXElement {
  // TODO: Make more components
  const sortable = createSortable(props.trip.tripId);
  return (
    <div
      use:sortable
      class="service-trip-card"
      classList={{ "bg-gray-base": sortable.isActiveDraggable }}
    >
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
