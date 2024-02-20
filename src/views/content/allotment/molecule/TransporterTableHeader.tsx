import { TableHeaderCol } from "../../../../component/table/atom/TableHeaderCol";
import { TableHeader } from "../../../../component/table/molecule/TableHeader";

export function TransporterTableHeader() {
  return (
    <TableHeader>
      <TableHeaderCol text="Nom" />
      <TableHeaderCol text="Type" />
      <TableHeaderCol text="Nombre de véhicules" />
      <TableHeaderCol end text="Actions" />
    </TableHeader>
  );
}
