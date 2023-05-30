import EnterpriseLogo from "./logo/EnterpriseLogo";
import OpenPictogram from "./logo/OpenPictogram";
import CloseLateralMenuLogo from "./logo/CloseLateralMenuLogo";
import { Show, createEffect, createSignal } from "solid-js";
import { useStateGui } from "../../StateGui";
import { For } from "solid-js";

import { MenuItemType } from "../../type";
import MenuItemsFields from "./MenuItemFields";

const [
  ,
  { toggleDisplayedMenu, setSelectedMenu, getSelectedMenu, getDisplayedMenu },
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
      <Show when={getDisplayedMenu() == true && displayText() == true}>
        {title()}
      </Show>
    </li>
  );
}

export default function () {
  const [divRef, setDivRef] = createSignal<HTMLElement | undefined>();
  const [waitingToDisplayText, SetWaitingToDisplayText] = createSignal(
    getDisplayedMenu()
  );

  createEffect(() => {
    divRef()?.addEventListener("transitionend", () => {
      SetWaitingToDisplayText(!waitingToDisplayText());
    });
  });

  return (
    <nav
      id="lateral-nav"
      classList={{ active: getDisplayedMenu() }}
      ref={setDivRef}
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

      <button id="lateral-close" onClick={toggleDisplayedMenu}>
        <Show when={getDisplayedMenu()} fallback={<OpenPictogram />}>
          <CloseLateralMenuLogo />
        </Show>
      </button>
    </nav>
  );
}
