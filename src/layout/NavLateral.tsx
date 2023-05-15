import {
  EnterpriseLogo,
  OpenLateralMenuLogo,
  CloseLateralMenuLogo,
} from "../export/Logos";
import { Show } from "solid-js";
import { useStateGui } from "../StateGui";
import { For } from "solid-js";

import { MenuItemType } from "../type";
import MenuItemsFields from "./MenuItemFields";

const [
  ,
  { toggleDisplayedMenu, setSelectedMenu, getSelectedMenu, getDisplayedMenu },
] = useStateGui();

function MenuItems(props: MenuItemType) {
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
      <Show when={getDisplayedMenu() == true}>{title()}</Show>
    </li>
  );
}

export default function () {
  return (
    <nav id="lateral-nav" classList={{ active: getDisplayedMenu() }}>
      <div class="lateral-nav-header">
        <EnterpriseLogo />
      </div>

      <ul class="lateral-nav-list">
        <For each={MenuItemsFields()}>
          {(menuItemArg) => {
            const { title, menuItem } = menuItemArg;
            return (
              <MenuItems
                title={title}
                menuItem={menuItem}
                Logo={menuItemArg.Logo}
              />
            );
          }}
        </For>
      </ul>

      <button id="lateral-close" onClick={toggleDisplayedMenu}>
        <Show when={getDisplayedMenu()} fallback={<OpenLateralMenuLogo />}>
          <CloseLateralMenuLogo />
        </Show>
      </button>
    </nav>
  );
}
