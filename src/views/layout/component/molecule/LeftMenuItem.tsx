import { JSXElement, Show, mergeProps } from "solid-js";

import LeftMenuItemLabel from "../atom/LeftMenuItemLabel";
import LeftMenuButtonLogo from "./LeftMenuButtonLogo";

import Pellet from "../../../../component/atom/Pellet";
import "./LeftMenuItem.css";

export interface LeftMenuItemProps {
  isDisabled?: boolean;
  displayedLabel: boolean;
  label: string;

  isSelected: boolean;
  Logo: () => JSXElement;

  onClick: () => void;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ isDisabled: false }, props);

  return (
    <li
      class="left-menu-item"
      classList={{
        active: !mergedProps.isDisabled && mergedProps.isSelected,
        disable: mergedProps.isDisabled,
      }}
      onClick={() => {
        console.log("onClick out if");

        if (!mergedProps.isDisabled) {
          console.log("onClick in if");
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

      <LeftMenuItemLabel
        isDisplayed={mergedProps.displayedLabel}
        isActive={mergedProps.isSelected}
        isDisabled={mergedProps.isDisabled}
        label={mergedProps.label}
      />

      <Show when={!mergedProps.isDisabled && mergedProps.isSelected}>
        <div class="left-menu-item-pellet">
          <Pellet />
        </div>
      </Show>
    </li>
  );
}
