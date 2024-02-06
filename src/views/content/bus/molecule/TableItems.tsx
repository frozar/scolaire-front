import { For, createSignal } from "solid-js";
import PencilIcon from "../../../../icons/PencilIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import "./TableItems.css";

type BusType = {
  name: string;
  capacity: number;
};

export const [getBus, setBus] = createSignal<BusType[]>([
  { name: "bus1", capacity: 10 },
  { name: "bus2", capacity: 12 },
  { name: "bus3", capacity: 14 },
  { name: "bus4", capacity: 16 },
  { name: "bus5", capacity: 18 },
]);

function editRow() {
  console.log("editButton");
}

function deleteRow() {
  console.log("deleteButton");
}

export function TableItems() {
  return (
    <For each={getBus()}>
      {(bus: BusType, i) => (
        <tr class="tableRow">
          <th>{bus.name}</th>
          <td class="text-center">{bus.capacity}</td>
          <td class="actionButtonContainer">
            <div class="actionButton" onClick={editRow}>
              <PencilIcon />
            </div>
            <div class="actionButton" onClick={deleteRow}>
              <TrashIcon />
            </div>
          </td>
        </tr>
      )}
    </For>
  );
}
