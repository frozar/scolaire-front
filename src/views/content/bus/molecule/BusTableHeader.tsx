import { TableHeaderCol } from "../../../../component/table/atom/TableHeaderCol";
import { TableHeader } from "../../../../component/table/molecule/TableHeader";
import "./BusTableHeader.css";

export function BusTableHeader() {
  return (
    <TableHeader>
      <TableHeaderCol text="Nom" />
      <TableHeaderCol text="Catégorie" />
      <TableHeaderCol text="Capacité" />
      <TableHeaderCol text="Accessibilité" />
      <TableHeaderCol text="Gabarit" />
      <TableHeaderCol text="Courses" />
      <TableHeaderCol text="Nombre de bus" />
      <TableHeaderCol text="Actions" end={true} />
    </TableHeader>
  );
}
