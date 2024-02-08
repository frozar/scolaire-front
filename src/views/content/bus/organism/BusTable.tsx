import { BusCategoryType } from "../../../../_entities/bus.entity";
import { TableHeader } from "../molecule/TableHeader";
import { TableRows } from "../molecule/TableRows";
import "./Bus.css";

interface BusTableProps {
  busList: BusCategoryType[];
  isEditMode: boolean;
}

export function BusTable(props: BusTableProps) {
  return (
    <table class="busTable">
      <TableHeader />
      <tbody>
        <TableRows isEditMode={props.isEditMode} busList={props.busList} />
      </tbody>
    </table>
  );
}
