import { For } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { InformationBoardTabType } from "../../../../../type";
import { InformationBoardTabsItem } from "../molecule/InformationBoardTabsItem";

import "./InformationBoardTabs.css";

const [, { setInformationBoardSelectedTab, getInformationBoardSelectedTab }] =
  useStateGui();

export interface InformationBoardTabsProps {
  tabs: InformationBoardTabType[];
}

function checkSelectedTab(tabs: InformationBoardTabType[]) {
  if (getInformationBoardSelectedTab() + 1 > tabs.length) {
    setInformationBoardSelectedTab(0);
  }
}

export function InformationBoardTabs(props: InformationBoardTabsProps) {
  checkSelectedTab(props.tabs);

  return (
    <nav class="information-board-tabs">
      <For each={props.tabs}>
        {(tab: InformationBoardTabType, index) => {
          return (
            <InformationBoardTabsItem
              label={tab.label}
              icon={tab.icon}
              isActive={getInformationBoardSelectedTab() === index()}
              onClick={() => setInformationBoardSelectedTab(index())}
            />
          );
        }}
      </For>
    </nav>
  );
}
