import Label from "../../board/component/atom/Label";
import "./VehicleCapacityInput.css";

interface VehicleCapacityInputProps {
  defaultValue: number;
  label: string;
  name: string;
  onChangeFunction: (value: number) => void;
}

export function VehicleCapacityInput(props: VehicleCapacityInputProps) {
  return (
    <div class="vehicle-capacity-container">
      <Label label={props.label} for={props.name} />
      <input
        class="vehicle-capacity-input"
        id={props.name}
        type="Number"
        value={props.defaultValue}
        onChange={(e) => props.onChangeFunction(Number(e.target.value))}
      />
    </div>
  );
}
