import Label from "../../board/component/atom/Label";
import "./VehicleNumberInput.css";

interface VehicleNumberInputProps {
  name: string;
  label: string;
  placeholder: string;
  onChange: (value: number) => void;
}

export function VehicleNumberInput(props: VehicleNumberInputProps) {
  return (
    <div class="vehicle-number-input">
      <Label label={props.label} for={props.name} />
      <input
        class="vehicle-number-input-field"
        type="number"
        id={props.name}
        placeholder={props.placeholder}
        onInput={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}
