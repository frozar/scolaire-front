import "./VehicleNumberInput.css";

interface VehicleNumberInputProps {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: number;
  onChange: (value: number) => void;
}

export function VehicleNumberInput(props: VehicleNumberInputProps) {
  return (
    <div class="vehicle-number-input">
      <label class="vehicle-number-input-label" for={props.name}>
        {props.label}
      </label>
      <input
        min={0}
        class="vehicle-number-input-field"
        type="number"
        value={props.defaultValue}
        id={props.name}
        placeholder={props.placeholder}
        onInput={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}
