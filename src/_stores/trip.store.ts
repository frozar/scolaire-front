import { createSignal } from "solid-js";
import { TripType } from "../_entities/trip.entity";

export const [getTrips, setTrips] = createSignal<TripType[]>([]);

export namespace TripStore {
  export function set(trips: TripType[]) {
    setTrips(trips);
  }
}
