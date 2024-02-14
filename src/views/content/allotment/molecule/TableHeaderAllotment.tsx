import { TableHeaderCol } from "../../../../component/table/atom/TableHeaderCol";
import { TableHeader } from "../../../../component/table/molecule/TableHeader";
import "./TableHeader.css";

export function TableHeaderAllotment() {
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
