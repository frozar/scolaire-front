import { createSignal } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";

export const [selectedEditTrip, setSelectedEditTrip] = createSignal<TripType>();

export function TripEdit() {
  return (
    <div>
      <div>TODO</div>
    </div>
  );
}
