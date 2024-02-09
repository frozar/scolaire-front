import { AddTableLine } from "../molecule/AddTableLine";
import { TableHeader } from "../molecule/TableHeader";
import { TableRows } from "../molecule/TableRows";
import { BusCategoryType } from "./Bus";
import "./Bus.css";

interface BusTableProps {
  busList: BusCategoryType[];
}

export function BusTable(props: BusTableProps) {
  return (
    <table class="busTable">
      <TableHeader />
      <tbody>
        <AddTableLine />
        <TableRows busList={props.busList} />
      </tbody>
    </table>
  );
}
