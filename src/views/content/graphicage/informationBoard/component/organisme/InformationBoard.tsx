import { For } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useStateGui } from "../../../../../../StateGui";
import { InformationBoardTabType } from "../../../../../../type";
import InformationBoardTabsItem from "../molecule/InformationBoardTabsItem";

import "./InformationBoard.css";

const [stateGui, { setSelectedTab }] = useStateGui();

interface InformationBoardProps {
  tabs: InformationBoardTabType[];
}

export function InformationBoard(props: InformationBoardProps) {
  return (
    <div class="information-board">
      <nav aria-label="Tabs">
        <For each={props.tabs}>
          {(tab, key) => (
            <InformationBoardTabsItem
              label={tab.label}
              icon={tab.icon}
              isActive={stateGui.selectedTab === key()}
              onClick={() => setSelectedTab(key())}
            />
          )}
        </For>
      </nav>
      <Dynamic component={props.tabs[stateGui.selectedTab].content} />
    </div>
  );
}
