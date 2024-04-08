import { createSignal } from "solid-js";
import { BusStopType } from "../_entities/busStops.entity";

export const [getBusStops, setBusStops] = createSignal<BusStopType[]>([]);

export namespace BusStopStore {
  export function set(stops: BusStopType[]) {
    setBusStops(stops);
  }
}
