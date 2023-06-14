import { JSXElement, mergeProps } from "solid-js";
import DashboardLogo from "../atom/DashboardLogo";
import "./LeftMenuButtonLogo.css";

export interface LeftMenuButtonLogoProps {
  logo: () => JSXElement;
  isActive?: boolean;
}

export default function (props: LeftMenuButtonLogoProps) {
  const mergedProps = mergeProps(
    { logo: DashboardLogo, isActive: false },
    props
  );

  return (
    <div
      class="left-menu-button-logo"
      classList={{ active: mergedProps.isActive == true }}
    >
      {mergedProps.logo()}
    </div>
  );
}
