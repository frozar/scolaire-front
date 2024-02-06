import { For, createSignal } from "solid-js";
import PencilIcon from "../../../../icons/PencilIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import "./TableItems.css";

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

export function TableItems() {
  return (
    <For each={getBus()}>
      {(bus: BusType, i) => (
        <tr class="tableRow">
          <td>{bus.name}</td>
          <td class="text-center">{bus.capacity}</td>
          <td class="text-center">{bus.trip}</td>
          <td class="text-center">{bus.quantity}</td>
          <td class="actionButtonContainer">
            <div class="actionButton">
              <PencilIcon />
            </div>
            <div class="actionButton">
              <TrashIcon />
            </div>
          </td>
        </tr>
      )}
    </For>
  );
}
