import { mergeProps, splitProps } from "solid-js";
import "./ActionSelector.css";

export interface ActionSelectorProps {
  isDisabled?: boolean;
}

export default function (props: ActionSelectorProps) {
  const mergedProps = mergeProps({ isDisabled: false }, props);
  const [local] = splitProps(mergedProps, ["isDisabled"]);

  return (
    <select id="action-selector" disabled={local.isDisabled}>
      <option selected value="null" />
      <option value="delete">Supprimer</option>
    </select>
  );
}
