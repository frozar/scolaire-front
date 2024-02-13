import { TableContent } from "../../../../component/table/molecule/TableContent";
import { AddTableLine } from "../molecule/AddTableLine";
import { TableHeaderAllotment } from "../molecule/TableHeader";
import { TableRows } from "../molecule/TableRows";
import { AllotmentType } from "./Allotment";
import "./Allotment.css";

interface AllotmentTableProps {
  allotmentList: AllotmentType[];
}

export function AllotmentTable(props: AllotmentTableProps) {
  return (
    <table class="allotmentTable">
      <TableHeaderAllotment />
      <TableContent>
        <AddTableLine />
        <TableRows allotmentList={props.allotmentList} />
      </TableContent>
    </table>
  );
}
