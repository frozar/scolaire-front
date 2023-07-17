import { For } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
// import { InformationBoardTabType } from "../../../../../type";
import { InformationBoardTabsItem } from "../molecule/InformationBoardTabsItem";

import { InformationBoardTabType } from "../../../../../type";
import "./InformationBoardTabs.css";

const [, { setInformationBoardSelectedTab, getInformationBoardSelectedTab }] =
  useStateGui();

export interface InformationBoardTabsProps {
  tabs: InformationBoardTabType[];
  // tabs: InformationBoardTabsItemProps[];
  // tabs: Omit<InformationBoardTabsItemProps, "onClick">;
}

function checkSelectedTabKey(tabs: InformationBoardTabType[]) {
  if (getInformationBoardSelectedTab() + 1 > tabs.length) {
    setInformationBoardSelectedTab(0);
  }
}

// export function InformationBoardTabs(props: InformationBoardTabsProps) {
export function InformationBoardTabs(props: InformationBoardTabsProps) {
  //TODO Question about the positionning of the checking function
  // eslint-disable-next-line solid/reactivity
  checkSelectedTabKey(props.tabs);

  return (
    <nav class="information-board-tabs">
      <For each={props.tabs}>
        {(tab: InformationBoardTabType, index) => {
          return (
            <InformationBoardTabsItem
              label={tab.label}
              icon={tab.icon}
              isActive={getInformationBoardSelectedTab() === index()}
              onClick={() => setInformationBoardSelectedTab(tab.id)}
            />
          );
        }}
      </For>
    </nav>
  );
}
