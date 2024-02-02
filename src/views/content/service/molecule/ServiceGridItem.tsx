import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

export function ServiceGridItem(props: { tripId: number }): JSXElement {
  return (
    <div>
      <div class="service-grid-item-trip">
        <div>{TripUtils.get(props.tripId).name}</div>
      </div>
      <div />
    </div>
  );
}
