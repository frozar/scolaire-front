import { JSXElement } from "solid-js";
import { InformationBoardTabsItemIcon } from "../atom/InformationBoardTabsItemIcon";
import { InformationBoardTabsItemLabel } from "../atom/InformationBoardTabsItemLabel";
import "./InformationBoardTabsItem.css";

export interface InformationBoardTabsItemProps {
  label: string;
  isActive: boolean;
  icon: () => JSXElement;
  onClick: (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) => void;
}

export function InformationBoardTabsItem(props: InformationBoardTabsItemProps) {
  return (
    <button
      class="information-board-tabs-item"
      classList={{
        active: props.isActive,
      }}
      onClick={(
        e: MouseEvent & {
          currentTarget: HTMLButtonElement;
          target: Element;
        }
      ) => props.onClick(e)}
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
