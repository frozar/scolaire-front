import { JSXElement } from "solid-js";

import "./InformationBoardTabsItemIcon.css";

export interface InformationBoardTabsItemIconProps {
  icon: () => JSXElement;
  isActive: boolean;
}

export function InformationBoardTabsItemIcon(
  props: InformationBoardTabsItemIconProps
) {
  return (
    <span
      class="information-board-tabs-item-icon"
      classList={{
        active: props.isActive,
      }}
    >
      {props.icon()}
    </span>
  );
}
