import { For } from "solid-js";
import { BusCategoryType } from "../organism/Bus";
import { TableLine } from "./TableLine";

interface TableLineProps {
  busList: BusCategoryType[];
}

export function TableRows(props: TableLineProps) {
  return (
    <For each={props.busList}>
      {(bus: BusCategoryType) => <TableLine busItem={bus} />}
    </For>
  );
}
