import { createSignal } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";

export const [selectedTrip, setSelectedTrip] = createSignal<TripType>();

export function TripDetails() {
  return <div>TOTO</div>;
}
