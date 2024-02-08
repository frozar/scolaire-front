import { For } from "solid-js";
import { BusCategoryType } from "../../../../_entities/bus.entity";
import { TableLine } from "./TableLine";

interface TableLineProps {
  busList: BusCategoryType[];
  isEditMode: boolean;
}

function isNewRowAdded(idx: number, newRowAdded: boolean) {
  if (idx == 0 && newRowAdded) {
    return true;
  }
  return false;
}

export function TableRows(props: TableLineProps) {
  return (
    <For each={props.busList}>
      {(bus: BusCategoryType, i) => <TableLine isEditMode={isNewRowAdded(i(), props.isEditMode)} busItem={bus} />}
    </For>
  );
}
