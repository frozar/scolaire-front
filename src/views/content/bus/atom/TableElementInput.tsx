import { TextInput } from "../../../../component/atom/TextInput";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import "./TableElement.css";

interface TableElementInputProps {
  onInputFunction: (value: string) => void;
  defaultValue: string;
  placeholder: string;
}

export function TableElementInput(props: TableElementInputProps) {
  return (
    <TableDataChilds>
      <TextInput
        onInput={props.onInputFunction}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
      />
    </TableDataChilds>
  );
}
