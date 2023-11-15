import { mergeProps } from "solid-js";
import "./LabeledCheckbox.css";

interface LabeledCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  for?: string;
  disabled?: boolean;
  verticalOffset?: boolean;
}

export function LabeledCheckbox(props: LabeledCheckboxProps) {
  const mergedProps = mergeProps(
    { disabled: false, verticalOffset: false },
    props
  );

  return (
    <div
      class="labeled-inline-checkbox"
      classList={{ offset: mergedProps.verticalOffset }}
    >
      <label for={props.for}>{props.label}</label>
      <input
        // eslint-disable-next-line solid/reactivity
        onChange={props.onChange}
        type="checkbox"
        id={props.for}
        checked={props.checked}
        disabled={mergedProps.disabled}
      />
    </div>
  );
}
