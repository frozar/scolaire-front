import { mergeProps } from "solid-js";
import "./LeftMenuItemLabel.css";

export interface LeftMenuItemLabelProps {
  isActive?: boolean;
  isDisabled?: boolean;
  label: string;
}

export default function (props: LeftMenuItemLabelProps) {
  const mergedProps = mergeProps({ isActive: false, isDisabled: false }, props);

  return (
    <span
      class="left-menu-item-label"
      classList={{
        disabled: mergedProps.isDisabled,
        active: !mergedProps.isDisabled && mergedProps.isActive,
      }}
    >
      {mergedProps.label}
    </span>
  );
}
