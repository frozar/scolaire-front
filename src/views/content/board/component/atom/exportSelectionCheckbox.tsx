import { JSXElement, Setter } from "solid-js";

interface ExportSelectionCheckboxProps {
  label: string;
  setter: Setter<boolean>;
}

export function ExportSelectionCheckbox(
  props: ExportSelectionCheckboxProps
): JSXElement {
  return (
    <div class="input-checkbox">
      <div class="flex">
        <input
          type="checkbox"
          onChange={(event) => onChange(props.setter, event.target.checked)}
        />
        <label>{props.label}</label>
      </div>
    </div>
  );
}
function onChange(setter: Setter<boolean>, checked: boolean) {
  setter(checked);
}
