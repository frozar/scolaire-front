import { TableHeaderCol } from "../../../../component/table/atom/TableHeaderCol";
import { TableHeader } from "../../../../component/table/molecule/TableHeader";

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
