import { createSignal } from "solid-js";
import { TripType } from "../_entities/trip.entity";

export const [getTrips, setTrips] = createSignal<TripType[]>([]);

export namespace TripStore {
  export function set(trips: TripType[] | ((prev: TripType[]) => TripType[])) {
    setTrips(trips);
    getTrips().sort((a, b) => a.name.localeCompare(b.name));
  }
}
