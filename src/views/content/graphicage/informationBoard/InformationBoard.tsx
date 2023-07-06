import { For, JSX } from "solid-js";
import InformationContent from "./InformationContent";

import { useStateGui } from "../../../../StateGui";

import { Dynamic } from "solid-js/web";
import InformationCircleIcon from "./component/atom/InformationCircleIcon";
import SettingsIcon from "./component/atom/SettingsIcon";
import InformationBoardSettings from "./component/molecule/InformationBoardSettings";
import InformationBoardTabsItem from "./component/molecule/InformationBoardTabsItem";

const [stateGui, { setSelectedTab, getDisplayedInformationBoard }] =
  useStateGui();

export function InformationBoard() {
  let refMenuContent!: HTMLDivElement;

  type InformationBoardTabType = {
    icon: () => JSX.Element;
    label: string;
    content: (props: object) => JSX.Element;
  };

  const tabs: InformationBoardTabType[] = [
    {
      icon: InformationCircleIcon,
      content: InformationContent,
      label: "Informations",
    },
    {
      icon: SettingsIcon,
      content: InformationBoardSettings,
      label: "Paramètres",
    },
  ];

  return (
    <div
      ref={refMenuContent}
      class="menu__custom"
      classList={{
        active: getDisplayedInformationBoard(),
      }}
    >
      <nav aria-label="Tabs">
        <For each={tabs}>
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
      <Dynamic component={tabs[stateGui.selectedTab].content} />
    </div>
  );
}
