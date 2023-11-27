import { For, mergeProps } from "solid-js";
import "./SelectInput.css";

interface SelectInputProps {
  defaultValue?: number | string;
  onChange: (value: number | string) => void;
  options: { text: string; value: string | number }[];
  defaultOptions?: string;
  disabled?: boolean;
}

export function SelectInput(props: SelectInputProps) {
  const mergedProps = mergeProps({ disabled: false }, props);
  function onChange(event: Event & { target: HTMLSelectElement }) {
    props.onChange(event.target.value);
  }

  return (
    <select
      onChange={onChange}
      class="selector"
      disabled={mergedProps.disabled}
    >
      <option value="default">{props.defaultOptions ?? "Options"}</option>
      <For each={props.options}>
        {(opt) => (
          <option value={opt.value} selected={props.defaultValue == opt.value}>
            {opt.text}
          </option>
        )}
      </For>
    </select>
  );
}
