import { VehicleNumberInput } from "./VehicleNumberInput";
import "./VehicleSizeInput.css";

interface VehicleSizeInputProps {
  defaultLength: number;
  defaultWidth: number;
  defaultHeight: number;
  onInputLength: (value: number) => void;
  onInputWidth: (value: number) => void;
  onInputHeight: (value: number) => void;
}

export function VehicleSizeInput(props: VehicleSizeInputProps) {
  return (
    <div>
      <p>Gabarit</p>
      <div class="vehicle-number-input-container">
        <VehicleNumberInput
          defaultValue={props.defaultLength}
          label="Longueur"
          name="length"
          onChange={props.onInputLength}
          placeholder="Entrer la longueur"
        />
        <VehicleNumberInput
          defaultValue={props.defaultWidth}
          label="Largeur"
          name="width"
          onChange={props.onInputWidth}
          placeholder="Entrer la largeur"
        />
        <VehicleNumberInput
          defaultValue={props.defaultHeight}
          label="Hauteur"
          name="height"
          onChange={props.onInputHeight}
          placeholder="Entrer la hauteur"
        />
      </div>
    </div>
  );
}
