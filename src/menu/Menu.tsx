import { Dynamic } from "solid-js/web";
import { createEffect, For } from "solid-js";
import MenuDraw from "./MenuDraw";
import MenuDelete from "./MenuRemoveLine";

import InformationContent from "../InformationContent";

import { useStateAction } from "../StateAction";
import { useStateGui } from "../StateGui";

const [stateAction, { toggleAltimetryAnimation }] = useStateAction();
const [stateGui, { toggleDisplayedMenu, setSelectedTab }] = useStateGui();

let refMenuContent: any;
let refMenuToggler: any;

function MenuToggler() {
  createEffect(() => {
    if (stateGui.displayedMenu) {
      refMenuToggler?.classList.add("active");
      refMenuContent?.classList.add("active");
    } else {
      refMenuToggler?.classList.remove("active");
      refMenuContent?.classList.remove("active");
    }
  });

  return (
    <div
      ref={refMenuToggler}
      class="menu__toggler btn btn-circle"
      onClick={toggleDisplayedMenu}
    >
      <div>
        <span></span>
      </div>
    </div>
  );
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      ClickOutside: (e: MouseEvent) => void;
    }
  }
}

function SettingsContent(props: any) {
  return (
    <div>
      <input
        id="animation-setting"
        type="checkbox"
        class="mr-2"
        value="animation"
        checked={stateAction.altimetry.animation}
        onChange={(e: any) => {
          toggleAltimetryAnimation();
        }}
        {...props}
      ></input>
      <label for="animation-setting">Animations</label>
    </div>
  );
}

function SettingsHorizontalIcon(props: any) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
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

export function InformationCircleIcon(props: any) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
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

function MenuContent() {
  type TabValueType = {
    // @ts-expect-error
    tabLabel: (props: any) => JSX.Element;
    // @ts-expect-error
    tabContent: (props: any) => JSX.Element;
  };
  type TabType = {
    info: TabValueType;
    settings: TabValueType;
  };

  const tabs: TabType = {
    info: { tabLabel: InformationCircleIcon, tabContent: InformationContent },
    settings: {
      tabLabel: SettingsHorizontalIcon,
      tabContent: SettingsContent,
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
      class="menu__custom p-2 w-80 bg-base-100 text-base-content text-left"
    >
      <div class="tabs mb-2">
        <For each={Object.keys(tabs)}>
          {(value: string) => {
            validateTabKey(value);
            const tabKey = value as keyof typeof tabs;
            const TabLabelComponent = tabs[tabKey].tabLabel;
            return (
              <a
                class="tab tab-lifted capitalize"
                classList={{ "tab-active": stateGui.selectedTab === tabKey }}
                onClick={() => setSelectedTab(tabKey)}
              >
                <TabLabelComponent width="24px" />
              </a>
            );
          }}
        </For>
      </div>
      <Dynamic
        component={tabs[stateGui.selectedTab as keyof typeof tabs].tabContent}
      />
    </div>
  );
}

export default function Menu() {
  return (
    <>
      <MenuToggler />
      <MenuContent />
      <MenuDraw />
      <MenuDelete />
    </>
  );
}
