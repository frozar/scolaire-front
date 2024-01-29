import { SelectInput } from "../atom/SelectInput";
import "./LabeledInputSelect.css";

interface LabeledInputSelectProps {
  label: string;
  defaultValue: number;
  onChange: (value: number | string) => void;
  options: { text: string; value: string | number }[];
  defaultOptions?: string;
  disabled?: boolean;
  indented?: boolean;
}
// TODO: Redo dirtyless
export function LabeledInputSelect(props: LabeledInputSelectProps) {
  return (
    <div class="labeled-selector-wrapper">
      <label class="selector-label">{props.label}</label>
      <SelectInput
        defaultOptions={props.defaultOptions}
        options={props.options}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        indented={props.indented}
      />
    </div>
  );
}
