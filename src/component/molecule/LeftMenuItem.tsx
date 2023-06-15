import { JSXElement, Show, mergeProps } from "solid-js";

import GraphicageLogo from "../atom/GraphicageLogo";
import { SelectedMenuType } from "../../type";
// import { useStateGui } from "../../StateGui";

import LeftMenuButtonLogo from "./LeftMenuButtonLogo";

import "./LeftMenuItem.css";

// const [, { getSelectedMenu, getDisplayedLeftMenu }] = useStateGui();

export interface LeftMenuItemProps {
  // Molecul props
  title: string;
  menuItem: SelectedMenuType;
  isActiveText: boolean;
  onClick: () => void;

  // Shared props
  isActiveItem: boolean;
  logo: () => JSXElement;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps(
    {
      title: "Graphicage",
      menuItem: "graphicage",
      logo: () => GraphicageLogo,
      isActiveText: true,
      isActiveItem: true,
    },
    props
  );

  // const isActiveItem = () => getSelectedMenu() === mergedProps.menuItem;
  // const isActiveText = () =>
  //   getDisplayedLeftMenu() == true && mergedProps.displayText == true;

  return (
    <li
      class="lateral-nav-item"
      classList={{ active: mergedProps.isActiveItem }}
      onClick={() => mergedProps.onClick()}
      // onClick={() => {
      //   setSelectedMenu(mergedProps.menuItem);
      // }}
    >
      {/* <LeftMenuButtonLogo
      logo={mergedProps.logo}
      isActive={mergedProps.isActiveItem}
    /> */}
      <LeftMenuButtonLogo isActive={mergedProps.isActiveItem}>
        {mergedProps.logo()}
      </LeftMenuButtonLogo>

      <Show when={mergedProps.isActiveText}>{mergedProps.title}</Show>
    </li>
  );
}
