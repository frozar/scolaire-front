import { AddTableLine } from "../molecule/AddTableLine";
import { TableHeader } from "../molecule/TableHeader";
import { TableRows } from "../molecule/TableRows";
import { AllotmentType } from "./Allotment";
import "./Allotment.css";

interface AllotmentTableProps {
  allotmentList: AllotmentType[];
}

export function AllotmentTable(props: AllotmentTableProps) {
  return (
    <table class="allotmentTable">
      <TableHeader />
      <tbody>
        <AddTableLine />
        <TableRows allotmentList={props.allotmentList} />
      </tbody>
    </table>
  );
}
