import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import { AddTableLine } from "../molecule/AddTableLine";
import { TableHeaderAllotment } from "../molecule/TableHeaderAllotment";
import { TableRows } from "../molecule/TableRows";
import { AllotmentType } from "./Allotment";
import "./Allotment.css";

interface AllotmentTableProps {
  allotmentList: AllotmentType[];
}

export function AllotmentTable(props: AllotmentTableProps) {
  return (
    <Table>
      <TableHeaderAllotment />
      <TableContent>
        <AddTableLine />
        <TableRows allotmentList={props.allotmentList} />
      </TableContent>
    </Table>
  );
}
