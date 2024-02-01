import { JSXElement } from "solid-js";

import { createSortable } from "@thisbeyond/solid-dnd";

import { ServiceTripCardLeft } from "../atom/ServiceTripCardLeft";
import { ServiceTripCardMiddle } from "../atom/ServiceTripCardMiddle";
import { ServiceTripCardRight } from "../atom/ServiceTripCardRight";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import "./ServiceTripCard.css";

interface ServiceTripCardProps {
  trip: DraggableTripType;
}

export function ServiceTripCard(props: ServiceTripCardProps): JSXElement {
  // eslint-disable-next-line solid/reactivity
  const sortable = createSortable(props.trip.tripId);
  return (
    <div
      // @ts-expect-errorts solid-dnd
      use:sortable
      class="service-trip-card"
      classList={{ "bg-gray-base": sortable.isActiveDraggable }}
    >
      <ServiceTripCardLeft trip={props.trip} />
      <ServiceTripCardMiddle />
      <ServiceTripCardRight trip={props.trip} />
    </div>
  );
}
