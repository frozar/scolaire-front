import { JSXElement, Show } from "solid-js";

import LeftMenuItemLabel from "../atom/LeftMenuItemLabel";
import LeftMenuButtonLogo from "./LeftMenuButtonLogo";

import "./LeftMenuItem.css";

export interface LeftMenuItemProps {
  isDisabled: boolean;
  label: string;
  displayedLabel: boolean;

  isSelected: () => boolean;
  Logo: () => JSXElement;

  onClick: () => void;
}

export default function (props: LeftMenuItemProps) {
  return (
    <li
      class="lateral-nav-item"
      classList={{
        active: !props.isDisabled && props.isSelected(),
        disable: props.isDisabled,
      }}
      onClick={() => {
        if (!props.isDisabled) {
          props.onClick();
        }
      }}
    >
      <LeftMenuButtonLogo
        isActive={props.isSelected()}
        isDisabled={props.isDisabled}
      >
        {props.Logo()}
      </LeftMenuButtonLogo>

      <Show when={props.displayedLabel}>
        <LeftMenuItemLabel
          isActive={props.isSelected()}
          isDisabled={props.isDisabled}
          label={props.label}
        />
      </Show>
    </li>
  );
}
