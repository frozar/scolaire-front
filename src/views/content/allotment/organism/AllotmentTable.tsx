import { For } from "solid-js";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import { AllotmentTableHeader } from "../molecule/AllotmentTableHeader";
import { AllotmentTableLine } from "../molecule/AllotmentTableLine";
import { AllotmentType, getAllotment } from "./Allotment";
import "./Allotment.css";

export function AllotmentTable() {
  return (
    <Table>
      <AllotmentTableHeader />
      <TableContent>
        <For each={getAllotment()}>
          {(allotment: AllotmentType) => (
            <AllotmentTableLine allotmentItem={allotment} />
          )}
        </For>
      </TableContent>
    </Table>
  );
}
