import { For, JSX } from "solid-js";
import InformationContent from "./InformationContent";

import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";

import InformationCircleIcon from "./component/atom/InformationCircleIcon";
import SettingsIcon from "./component/atom/SettingsIcon";
import InformationBoardTabsItem from "./component/molecule/InformationBoardTabsItem";

const [stateAction, { toggleAltimetryAnimation }] = useStateAction();
const [stateGui, { setSelectedTab, getDisplayedInformationBoard }] =
  useStateGui();

function SettingsContent(props: object) {
  return (
    <div>
      <input
        id="animation-setting"
        type="checkbox"
        class="mr-2"
        value="animation"
        checked={stateAction.altimetry.animation}
        onChange={() => {
          toggleAltimetryAnimation();
        }}
        {...props}
      />
      <label for="animation-setting">Animations</label>
    </div>
  );
}

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
      content: SettingsContent,
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
          {
            (tab, key) => (
              <InformationBoardTabsItem
                label={tab.label}
                icon={tab.icon}
                // TODO change the selectdTab for using the tabKey
                isActive={stateGui.selectedTab === key()}
                onClick={() => setSelectedTab(key())}
              />
            )

            // validateTabKey(value);
            // const tabKey = value as keyof typeof tabs;
            // const TabLabelComponent = tabs[tabKey].tabLabel;
            // const TabNameComponent = tabs[tabKey].tabName;
            // return (
            //   <button
            //     classList={{
            //       "group active": stateGui.selectedTab === tabKey,
            //       group: stateGui.selectedTab != tabKey,
            //     }}
            //     onClick={() => setSelectedTab(tabKey)}
            //   >
            //     <TabLabelComponent width="24px" />
            //     <TabNameComponent />
            //   </button>
            // );
          }
        </For>
      </nav>
      {/* <Dynamic component={tabs[stateGui.selectedTab].content} /> */}
    </div>
  );
}
