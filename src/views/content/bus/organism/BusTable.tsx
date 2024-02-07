import { TableHeader } from "../molecule/TableHeader";
import { TableRows } from "../molecule/TableRows";
import "./Bus.css";

export function BusTable() {
  return (
    <table class="busTable">
      <TableHeader />
      <tbody>
        <TableRows />
      </tbody>
    </table>
  );
}
