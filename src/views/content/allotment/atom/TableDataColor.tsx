import { TableContent } from "../../../../component/table/molecule/TableContent";
import "./TableDataColor.css";

export function TableDataColor(props: { color: string }) {
  return (
    <TableContent
      children={<input type="color" disabled value={props.color} />}
    />
  );
}
