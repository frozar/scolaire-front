import "./TableElement.css";

interface TableElementNumberInputProps {
  defaultValue: number;
  onChangeFunction: (value: number) => void;
}

export function TableElementNumberInput(props: TableElementNumberInputProps) {
  return (
    <td class="tableEdit">
      <input
        type="Number"
        value={props.defaultValue}
        onChange={(e) => props.onChangeFunction(Number(e.target.value))}
      />
    </td>
  );
}
