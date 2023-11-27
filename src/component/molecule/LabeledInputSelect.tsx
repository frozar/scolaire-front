import { SelectInput } from "../atom/SelectInput";

interface LabeledInputSelectProps {
  label: string;
  defaultValue: number;
  onChange: (value: number | string) => void;
  options: { text: string; value: string | number }[];
  defaultOptions?: string;
  disabled?: boolean;
}

export function LabeledInputSelect(props: LabeledInputSelectProps) {
  return (
    <div class="inline-grid my-2">
      <label class="text-xl">{props.label}</label>
      <SelectInput
        defaultOptions={props.defaultOptions}
        options={props.options}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
      />
    </div>
  );
}
