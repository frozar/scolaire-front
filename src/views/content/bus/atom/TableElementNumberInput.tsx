import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import "./TableElement.css";

interface TableElementNumberInputProps {
  defaultValue: number;
  onChangeFunction: (value: number) => void;
}

export function TableElementNumberInput(props: TableElementNumberInputProps) {
  return (
    <TableDataChilds>
      <input
        type="Number"
        value={props.defaultValue}
        onChange={(e) => props.onChangeFunction(Number(e.target.value))}
      />
    </TableDataChilds>
  );
}
