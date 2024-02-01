import { JSXElement } from "solid-js";
import { ServiceTripCardLeft } from "../atom/ServiceTripCardLeft";
import { ServiceTripCardMiddle } from "../atom/ServiceTripCardMiddle";
import { ServiceTripCardRight } from "../atom/ServiceTripCardRight";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import "./ServiceTripCardDragged.css";

export function ServiceTripCardDragged(props: {
  trip: DraggableTripType;
}): JSXElement {
  return (
    <div class="service-trip-card service-trip-card-dragged">
      <ServiceTripCardLeft trip={props.trip} />
      <ServiceTripCardMiddle />
      <ServiceTripCardRight trip={props.trip} />
    </div>
  );
}
