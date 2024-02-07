import { For, createSignal } from "solid-js";
import { TableLine } from "./TableLine";

type BusType = {
  name: string;
  capacity: number;
  trip: number;
  quantity: number;
};

export const [getBus, setBus] = createSignal<BusType[]>([
  { name: "bus1", capacity: 10, trip: 0, quantity: 0 },
  { name: "bus2", capacity: 12, trip: 0, quantity: 0 },
  { name: "bus3", capacity: 14, trip: 0, quantity: 0 },
  { name: "bus4", capacity: 16, trip: 0, quantity: 0 },
  { name: "bus5", capacity: 18, trip: 0, quantity: 0 },
]);

export function TableRows() {
  return (
    <For each={getBus()}>{(bus: BusType, i) => <TableLine {...bus} />}</For>
  );
}
