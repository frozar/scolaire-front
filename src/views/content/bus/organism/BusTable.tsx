import { For } from "solid-js";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import { BusTableHeader } from "../molecule/BusTableHeader";
import { BusTableLine } from "../molecule/BusTableLine";
import { BusCategoryType, getBus } from "./Bus";
import "./Bus.css";

export function BusTable() {
  return (
    <Table>
      <BusTableHeader />
      <TableContent>
        <For each={getBus()}>
          {(bus: BusCategoryType) => <BusTableLine busItem={bus} />}
        </For>
      </TableContent>
    </Table>
  );
}
