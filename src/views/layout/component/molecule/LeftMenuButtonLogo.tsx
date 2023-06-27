import { JSXElement, children, mergeProps } from "solid-js";
import "./LeftMenuButtonLogo.css";

export interface LeftMenuButtonLogoProps {
  isActive?: boolean;
  isDisabled?: boolean;
  children: JSXElement;
}

export default function (props: LeftMenuButtonLogoProps) {
  const logo = children(() => props.children);

  const mergedProps = mergeProps({ isActive: false, isDisabled: false }, props);

  return (
    <span
      class="left-menu-button-logo"
      classList={{
        disabled: mergedProps.isDisabled,
        active: !mergedProps.isDisabled && mergedProps.isActive,
      }}
    >
      {logo()}
    </span>
  );
}
