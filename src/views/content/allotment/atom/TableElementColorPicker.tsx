import { ColorPicker } from "../../board/component/atom/ColorPicker";
import "./TableElementColorPicker.css";

interface TableElementColorPickerProps {
  defaultColor: string;
  onInputFunction: (value: string) => void;
}

export function TableElementColorPicker(props: TableElementColorPickerProps) {
  return (
    <td class="tableEdit">
      <ColorPicker
        defaultColor={props.defaultColor}
        title=""
        onInput={props.onInputFunction}
        onChange={props.onInputFunction}
      />
    </td>
  );
}
