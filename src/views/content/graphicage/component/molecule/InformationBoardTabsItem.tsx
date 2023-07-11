import { JSXElement } from "solid-js";
import { InformationBoardTabsItemIcon } from "../atom/InformationBoardTabsItemIcon";
import { InformationBoardTabsItemLabel } from "../atom/InformationBoardTabsItemLabel";
import "./InformationBoardTabsItem.css";

export interface InformationBoardTabsItemProps {
  label: string;
  isActive: boolean;
  icon: () => JSXElement;
  onClick: () => void;
}

export function InformationBoardTabsItem(props: InformationBoardTabsItemProps) {
  return (
    <button
      class="information-board-tabs-item"
      classList={{
        active: props.isActive,
      }}
      onClick={() => props.onClick()}
    >
      <InformationBoardTabsItemIcon
        icon={props.icon}
        isActive={props.isActive}
      />
      <InformationBoardTabsItemLabel
        label={props.label}
        isActive={props.isActive}
      />
    </button>
  );
}
