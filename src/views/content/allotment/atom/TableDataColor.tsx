import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import "./TableDataColor.css";

export function TableDataColor(props: { color: string }) {
  return (
    <TableDataChilds>
      <input type="color" disabled value={props.color} />
    </TableDataChilds>
  );
}
