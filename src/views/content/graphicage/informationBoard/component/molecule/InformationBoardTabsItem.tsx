import { JSXElement } from "solid-js";
import InformationBoardTabsItemIcon from "../atom/InformationBoardTabsItemIcon";
import InformationBoardTabsItemLabel from "../atom/InformationBoardTabsItemLabel";

export interface InformationBoardTabsItem {
  label: string;
  icon: () => JSXElement;
  isActive: boolean;
  onClick: () => void;
}

export default function (props: InformationBoardTabsItem) {
  return (
    <button onClick={() => props.onClick()}>
      <InformationBoardTabsItemIcon
        isActive={props.isActive}
        icon={props.icon}
      />

      <InformationBoardTabsItemLabel
        isActive={props.isActive}
        label={props.label}
      />
    </button>
  );
}
