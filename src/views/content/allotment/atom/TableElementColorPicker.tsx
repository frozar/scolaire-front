import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { ColorPicker } from "../../board/component/atom/ColorPicker";
import "./TableElementColorPicker.css";

interface TableElementColorPickerProps {
  defaultColor: string;
  onInputFunction: (value: string) => void;
}

export function TableElementColorPicker(props: TableElementColorPickerProps) {
  return (
    <TableDataChilds>
      <ColorPicker
        defaultColor={props.defaultColor}
        title=""
        onInput={props.onInputFunction}
        onChange={props.onInputFunction}
      />
    </TableDataChilds>
  );
}
