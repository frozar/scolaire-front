import { For, JSXElement, mergeProps } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { InformationBoardTabsItem } from "../molecule/InformationBoardTabsItem";
// TODO: maybe remove this component ?
import "./InformationBoardTabs.css";

const [, { getInformationBoardSelectedTab, setInformationBoardSelectedTab }] =
  useStateGui();

export type informationBoardTabIdType = "information" | "settings";

export type InformationBoardTabType = {
  id: informationBoardTabIdType;
  label: string;
  icon: () => JSXElement;
};

export interface InformationBoardTabsProps {
  tabs: InformationBoardTabType[];
  getInformationBoardSelectedTab?: () => informationBoardTabIdType;
  setInformationBoardSelectedTab?: (key: informationBoardTabIdType) => void;
}

export function InformationBoardTabs(props: InformationBoardTabsProps) {
  const mergedProps = mergeProps(
    { getInformationBoardSelectedTab, setInformationBoardSelectedTab },
    props
  );

  return (
    <nav class="information-board-tabs">
      <For each={props.tabs}>
        {(tab: InformationBoardTabType) => {
          return (
            <InformationBoardTabsItem
              label={tab.label}
              icon={tab.icon}
              isActive={mergedProps.getInformationBoardSelectedTab() === tab.id}
              onClick={() => mergedProps.setInformationBoardSelectedTab(tab.id)}
            />
          );
        }}
      </For>
    </nav>
  );
}
