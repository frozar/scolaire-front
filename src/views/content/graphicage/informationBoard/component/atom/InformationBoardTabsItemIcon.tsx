import { JSXElement } from "solid-js";
import "./InformationBoardTabsItemIcon.css";

export interface InformationBoardTabsItemIconProps {
  isActive: boolean;
  icon: () => JSXElement;
}

export default function (props: InformationBoardTabsItemIconProps) {
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
