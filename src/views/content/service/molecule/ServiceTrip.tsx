import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

import "./ServiceTrip.css";

export function ServiceTrip(props: { id: number }): JSXElement {
  return <div class="service-trip">{TripUtils.get(props.id).name}</div>;
}
