import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import { TableHeaderBus } from "../molecule/TableHeaderBus";
import { TableRows } from "../molecule/TableRows";
import { BusCategoryType } from "./Bus";
import "./Bus.css";

interface BusTableProps {
  busList: BusCategoryType[];
}

export function BusTable(props: BusTableProps) {
  return (
    <Table>
      <TableHeaderBus />
      <TableContent>
        <TableRows busList={props.busList} />
      </TableContent>
    </Table>
  );
}
