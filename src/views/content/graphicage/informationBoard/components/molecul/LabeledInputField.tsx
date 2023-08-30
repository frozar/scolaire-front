import Label from "../atom/Label";
import "./LabeledInputField.css";

export interface LabeledInputFieldProps {
  name: string;
  value: string | number;
  placeholder?: string;
  onInput: (
    e: Event & {
      target: HTMLInputElement;
    }
  ) => void;
}

export default function (props: LabeledInputFieldProps) {
  return (
    <div class="labeled-input-field">
      <Label label="Nom de la ligne" for={props.name} />
      <input
        id={props.name}
        type="text"
        class="labeled-input"
        placeholder={props.placeholder}
        value={props.value}
        onInput={(e) => props.onInput(e)}
      />
    </div>
  );
}
