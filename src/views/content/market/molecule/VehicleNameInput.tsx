import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import "./VehicleNameInput.css";

interface VehicleNameInputProps {
  defaultValue: string;
  onInputFunction: (value: string) => void;
}

export function VehicleNameInput(props: VehicleNameInputProps) {
  return (
    <div class="vehicle-name-input">
      <LabeledInputField
        label="Nom d'usage"
        placeholder="Entrer un nom"
        value={props.defaultValue}
        onInput={(e) => props.onInputFunction(e.target.value)}
        name="name"
      />
    </div>
  );
}
