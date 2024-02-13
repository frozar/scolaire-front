import { For } from "solid-js";
import { AllotmentType } from "../organism/Allotment";
import { TableLine } from "./TableLine";

interface TableRowsProps {
  allotmentList: AllotmentType[];
}

export function TableRows(props: TableRowsProps) {
  return (
    <For each={props.allotmentList}>
      {(allotment: AllotmentType) => <TableLine allotmentItem={allotment} />}
    </For>
  );
}
