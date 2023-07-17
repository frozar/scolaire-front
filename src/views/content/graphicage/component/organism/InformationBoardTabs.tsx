import { For, JSXElement, mergeProps } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { InformationBoardTabsItem } from "../molecule/InformationBoardTabsItem";

import "./InformationBoardTabs.css";

const [, { getInformationBoardSelectedTab, setInformationBoardSelectedTab }] =
  useStateGui();

export type tabType = "information" | "settings";

export type InformationBoardTabType = {
  id: tabType;
  label: string;
  icon: () => JSXElement;
};

export interface InformationBoardTabsProps {
  tabs: InformationBoardTabType[];
  getInformationBoardSelectedTab?: () => tabType;
  setInformationBoardSelectedTab?: (key: tabType) => void;
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
