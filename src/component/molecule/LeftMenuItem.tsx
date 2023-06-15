import { JSXElement, Show, mergeProps } from "solid-js";

import LeftMenuItemLabel from "../atom/LeftMenuItemLabel";
import LeftMenuButtonLogo from "./LeftMenuButtonLogo";

import "./LeftMenuItem.css";

export interface LeftMenuItemProps {
  isDisabled?: boolean;
  label: string;
  displayedLabel: boolean;

  isSelected: boolean;
  Logo: () => JSXElement;

  onClick: () => void;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ isDisabled: false }, props);

  return (
    <li
      class="lateral-nav-item"
      classList={{
        active: !mergedProps.isDisabled && mergedProps.isSelected,
        disable: mergedProps.isDisabled,
      }}
      onClick={() => {
        if (!mergedProps.isDisabled) {
          mergedProps.onClick();
        }
      }}
    >
      <LeftMenuButtonLogo
        isActive={mergedProps.isSelected}
        isDisabled={mergedProps.isDisabled}
      >
        {mergedProps.Logo()}
      </LeftMenuButtonLogo>

      <Show when={mergedProps.displayedLabel}>
        <LeftMenuItemLabel
          isActive={mergedProps.isSelected}
          isDisabled={mergedProps.isDisabled}
          label={mergedProps.label}
        />
      </Show>
    </li>
  );
}
