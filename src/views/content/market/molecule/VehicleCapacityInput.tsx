import Label from "../../board/component/atom/Label";
import "./VehicleCapacityInput.css";

interface VehicleCapacityInputProps {
  defaultValue: number;
  onChangeFunction: (value: number) => void;
}

export function VehicleCapacityInput(props: VehicleCapacityInputProps) {
  return (
    <div class="vehicle-capacity-container">
      <Label label="Capacité" for="vCapacity" />
      <input
        class="vehicle-capacity-input"
        id="vCapacity"
        type="Number"
        value={props.defaultValue}
        onChange={(e) => props.onChangeFunction(Number(e.target.value))}
      />
    </div>
  );
}
