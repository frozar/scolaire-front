import Label from "../atom/Label";
import "./LabeledInputNumber.css";

export interface LabeledInputNumberProps {
  name: string;
  value: number;
  placeholder?: string;
  onInput: (
    e: Event & {
      target: HTMLInputElement;
    }
  ) => void;
  label: string;
}

export function LabeledInputNumber(props: LabeledInputNumberProps) {
  return (
    <div class="labeled-input-number">
      <Label label={props.label} for={props.name} />
      <input
        id={props.name}
        type="number"
        class="labeled-input"
        placeholder={props.placeholder}
        value={props.value}
        onInput={(e) => props.onInput(e)}
      />
    </div>
  );
}
