import { For, JSX, JSXElement } from "solid-js";
import { Dynamic } from "solid-js/web";
import InformationContent from "./InformationContent";

import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";
import { InformationBoardTabsItemIcon } from "../component/atom/InformationBoardTabsItemIcon";
import { InformationBoardTabsItemLabel } from "../component/atom/InformationBoardTabsItemLabel";
import InformationCircleIcon from "../component/atom/InformationCircleIcon";
import SettingsIcon from "../component/atom/SettingsIcon";

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

  type TabValueType = {
    tabLabel: () => JSXElement;
    tabContent: (props: object) => JSX.Element;
    tabName: string;
  };
  type TabType = {
    info: TabValueType;
    settings: TabValueType;
  };

  const tabs: TabType = {
    info: {
      tabLabel: InformationCircleIcon,
      tabContent: InformationContent,
      tabName: "Informations",
    },
    settings: {
      tabLabel: SettingsIcon,
      tabContent: SettingsContent,
      tabName: "Paramètres",
    },
  };
  type TabKey = keyof typeof tabs;

  function validateTabKey(value: string): asserts value is TabKey {
    if (!(value in tabs)) {
      throw Error("invalid tab key");
    }
  }

  return (
    <div
      ref={refMenuContent}
      class="menu__custom"
      classList={{
        active: getDisplayedInformationBoard(),
      }}
    >
      <nav aria-label="Tabs">
        <For each={Object.keys(tabs)}>
          {(value: string) => {
            validateTabKey(value);
            const tabKey = value as keyof typeof tabs;
            const icon = tabs[tabKey].tabLabel;
            const tabName = tabs[tabKey].tabName;
            const active = stateGui.selectedTab === tabKey;
            const group = stateGui.selectedTab != tabKey;
            return (
              <button
                classList={{
                  "group active": active,
                  group: group,
                }}
                onClick={() => setSelectedTab(tabKey)}
              >
                <InformationBoardTabsItemIcon icon={icon} isActive={active} />
                <InformationBoardTabsItemLabel
                  label={tabName}
                  isActive={active}
                />
              </button>
            );
          }}
        </For>
      </nav>
      <Dynamic
        component={tabs[stateGui.selectedTab as keyof typeof tabs].tabContent}
      />
    </div>
  );
}
