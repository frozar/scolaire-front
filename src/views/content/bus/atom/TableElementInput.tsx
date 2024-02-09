import { TextInput } from "../../../../component/atom/TextInput";
import "./TableElement.css";

interface TableElementInputProps {
  onInputFunction: (value: string) => void;
  defaultValue: string;
  placeholder: string;
}

export function TableElementInput(props: TableElementInputProps) {
  return (
    <td class="tableEdit">
      <TextInput
        onInput={props.onInputFunction}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
      />
    </td>
  );
}
