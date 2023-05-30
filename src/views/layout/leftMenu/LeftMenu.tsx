import EnterpriseLogo from "./logo/EnterpriseLogo";
import OpenPictogram from "./logo/OpenPictogram";
import ClosePictogram from "./logo/ClosePictogram";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import { useStateGui } from "../../../StateGui";
import { For } from "solid-js";

import { MenuItemType } from "../../../type";
import MenuItemsFields from "./MenuItemFields";

const [
  ,
  {
    setSelectedMenu,
    getSelectedMenu,
    toggleDisplayedLeftMenu,
    getDisplayedLeftMenu,
  },
] = useStateGui();

function MenuItems(props: MenuItemType) {
  const displayText = () => props.displayText;
  const title = () => props.title;
  const menuItem = () => props.menuItem;

  const Logo = () => {
    return <>{props.Logo}</>;
  };

  return (
    <li
      class="lateral-nav-item"
      classList={{ active: getSelectedMenu() === menuItem() }}
      onClick={() => {
        setSelectedMenu(menuItem());
      }}
    >
      <Logo />
      <Show when={getDisplayedLeftMenu() == true && displayText() == true}>
        {title()}
      </Show>
    </li>
  );
}

export default function () {
  const [waitingToDisplayText, SetWaitingToDisplayText] = createSignal(
    getDisplayedLeftMenu()
  );

  let refDivLeftMenu!: HTMLElement;

  onMount(() => {
    refDivLeftMenu.addEventListener("transitionend", () => {
      SetWaitingToDisplayText(!waitingToDisplayText());
    });
  });

  return (
    <nav
      id="lateral-nav"
      classList={{ active: getDisplayedLeftMenu() }}
      ref={refDivLeftMenu}
    >
      <div class="lateral-nav-header">
        <EnterpriseLogo />
      </div>

      <ul class="lateral-nav-list">
        <For each={MenuItemsFields(waitingToDisplayText())}>
          {(menuItemArg) => {
            const { title, menuItem } = menuItemArg;
            return (
              <MenuItems
                title={title}
                menuItem={menuItem}
                Logo={menuItemArg.Logo}
                displayText={waitingToDisplayText()}
              />
            );
          }}
        </For>
      </ul>

      <button id="lateral-close" onClick={toggleDisplayedLeftMenu}>
        <Show when={getDisplayedLeftMenu()} fallback={<OpenPictogram />}>
          <ClosePictogram />
        </Show>
      </button>
    </nav>
  );
}
