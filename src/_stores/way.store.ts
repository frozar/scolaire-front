import { createSignal } from "solid-js";
import { WayType } from "../_entities/way.entity";

export const [getWays, setWays] = createSignal<WayType[]>([]);

export namespace WayStore {
  export function set(ways: WayType[]) {
    setWays(ways);
  }
}
