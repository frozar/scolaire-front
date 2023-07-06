import { For, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import InformationContent from "./InformationContent";

import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";

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

function SettingsHorizontalIcon(props: object) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      stroke-width={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
      />
    </svg>
  );
}

export function InformationCircleIcon(props: object) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      stroke-width={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

function InformationName() {
  return <span>Informations</span>;
}

function SettingsName() {
  return <span>Paramètres</span>;
}

export function InformationBoard() {
  let refMenuContent!: HTMLDivElement;

  type TabValueType = {
    tabLabel: (props: object & { width: string }) => JSX.Element;
    tabContent: (props: object) => JSX.Element;
    tabName: (props: object) => JSX.Element;
  };
  type TabType = {
    info: TabValueType;
    settings: TabValueType;
  };

  const tabs: TabType = {
    info: {
      tabLabel: InformationCircleIcon,
      tabContent: InformationContent,
      tabName: InformationName,
    },
    settings: {
      tabLabel: SettingsHorizontalIcon,
      tabContent: SettingsContent,
      tabName: SettingsName,
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
        // _active: getDisplayedLeftMenu(),
        active: getDisplayedInformationBoard(),
      }}
    >
      <nav aria-label="Tabs">
        <For each={Object.keys(tabs)}>
          {(value: string) => {
            validateTabKey(value);
            const tabKey = value as keyof typeof tabs;
            const TabLabelComponent = tabs[tabKey].tabLabel;
            const TabNameComponent = tabs[tabKey].tabName;
            return (
              <button
                classList={{
                  "group active": stateGui.selectedTab === tabKey,
                  group: stateGui.selectedTab != tabKey,
                }}
                onClick={() => setSelectedTab(tabKey)}
              >
                <TabLabelComponent width="24px" />
                <TabNameComponent />
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
