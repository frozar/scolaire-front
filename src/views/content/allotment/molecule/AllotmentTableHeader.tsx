import { TableHeaderCol } from "../../../../component/table/atom/TableHeaderCol";
import { TableHeader } from "../../../../component/table/molecule/TableHeader";
import "./AllotmentTableHeader.css";

export function AllotmentTableHeader() {
  return (
    <TableHeader>
      <TableHeaderCol text="Nom" />
      <TableHeaderCol text="Couleur" />
      <TableHeaderCol text="Nombre de course" />
      <TableHeaderCol text="Nombre de bus" />
      <TableHeaderCol text="Actions" end={true} />
    </TableHeader>
  );
}
