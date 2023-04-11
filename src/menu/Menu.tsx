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
  return (<>
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
    <span>Paramètres</span>
    </>);
}

export function InformationCircleIcon(props: any) {
  return (<>
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
    <span>Informations</span>
  </>);
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
            // const 
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
<div>
  <div class="sm:hidden">
    <label for="tabs" class="sr-only">Select a tab</label>
    <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
      <option>My Account</option>

      <option>Company</option>

      <option selected >Team Members</option>

      <option>Billing</option>
    </select>
  </div>
  <div class="hidden sm:block">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium">

          <svg class="text-gray-400 group-hover:text-gray-500 -ml-0.5 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
          <span>My Account</span>
        </a>

        <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium">
          <svg class="text-gray-400 group-hover:text-gray-500 -ml-0.5 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75v-2.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v2.5a.75.75 0 01-.75.75h-3.5a.75.75 0 010-1.5H4zm3-11a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zM7.5 9a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zM11 5.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1zm.5 3.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z" clip-rule="evenodd" />
          </svg>
          <span>Company</span>
        </a>

        <a href="#" class="border-indigo-500 text-indigo-600 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium" aria-current="page">
          <svg class="text-indigo-500 -ml-0.5 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
          </svg>
          <span>Team Members</span>
        </a>

        <a href="#" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium">
          <svg class="text-gray-400 group-hover:text-gray-500 -ml-0.5 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clip-rule="evenodd" />
          </svg>
          <span>Billing</span>
        </a>
      </nav>
    </div>
  </div>
</div>
      <div>
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">Select a tab</label>
          <select id="tabs" name="tabs" class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
            <option selected >Informations</option>

            <option>Paramètres</option>
          </select>
        </div>
        <div class="hidden sm:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 border-indigo-500 text-indigo-600" aria-label="Tabs">
              <For each={Object.keys(tabs)}>
                {(value: string) => {
                  validateTabKey(value);
                  const tabKey = value as keyof typeof tabs;
                  const TabLabelComponent = tabs[tabKey].tabLabel;
                  return (
                    <button
                      class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                      classList={{ "tab-active": stateGui.selectedTab === tabKey }}
                      // onClick={() => setSelectedTab(tabKey)}
                      onClick={(e) => e.target.classList = "border-indigo-500 text-indigo-600 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"}
                    >
                      <TabLabelComponent width="24px" />
                    </button>
                  );
                }}
              </For>
            </nav>
          </div>
        </div>
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
