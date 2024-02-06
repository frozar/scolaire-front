import "../organism/Bus.css";
import { TableHeader } from "./TableHeader";
import { TableItems } from "./TableItems";

export function BusTable() {
  return (
    <table class="busTable">
      <TableHeader />
      <tbody>
        <TableItems />
      </tbody>
    </table>
  );
}
