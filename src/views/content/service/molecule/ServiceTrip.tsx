import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

export function ServiceTrip(props: { id: number }): JSXElement {
  return (
    <div class="border border-blue-500 w-24 h-24">
      {TripUtils.get(props.id).name}
    </div>
  );
}
