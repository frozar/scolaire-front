import { For, JSX, JSXElement } from "solid-js";
import { Dynamic } from "solid-js/web";
import InformationContent from "./InformationContent";

import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";
import InformationCircleIcon from "../component/atom/InformationCircleIcon";
import SettingsIcon from "../component/atom/SettingsIcon";
import { InformationBoardTabsItem } from "../component/molecule/InformationBoardTabsItem";

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
            const label = tabs[tabKey].tabName;
            const active = stateGui.selectedTab === tabKey;
            return (
              <InformationBoardTabsItem
                label={label}
                icon={icon}
                isActive={active}
                onClick={() => setSelectedTab(tabKey)}
              />
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
