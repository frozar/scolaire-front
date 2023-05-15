import {
  EnterpriseLogo,
  OpenLateralMenuLogo,
  CloseLateralMenuLogo,
  LateralMenuGraphicageLogo,
  // LateralMenuDashboardLogo,
  // LateralMenuVoirieLogo,
  // LateralMenuEtablissementLogo,
  LateralMenuArretsLogo,
  // LateralMenuSettingsLogo,
  // LateralMenuSupportLogo,
} from "../export/Logos";
import { Show } from "solid-js";
import { useStateGui } from "../StateGui";
import { For } from "solid-js";

import { MenuItemType } from "../type";

const [
  ,
  { toggleDisplayedMenu, setSelectedMenu, getSelectedMenu, getDisplayedMenu },
] = useStateGui();

function MenuItems(props: MenuItemType) {
  const title = () => props.title;
  const menuItem = () => props.menuItem;
  const Logo = () => props.Logo;

  return (
    <li
      class="lateral-nav-item"
      classList={{ active: getSelectedMenu() === menuItem() }}
      onClick={() => {
        setSelectedMenu(menuItem());
      }}
    >
      {Logo}
      <Show when={getDisplayedMenu() == true}>{title}</Show>
    </li>
  );
}

export default function () {
  const menuItems: MenuItemType[] = [
    {
      title: "Graphicage",
      menuItem: "graphicage",
      Logo: LateralMenuGraphicageLogo,
    },
    {
      title: "Arrêts",
      menuItem: "arrets",
      Logo: LateralMenuArretsLogo,
    },
    // [LateralMenuDashboardLogo, "Dashboard", "dashboard"],
    // [LateralMenuVoirieLogo, "Voirie", "voirie"],
    // [LateralMenuEtablissementLogo, "Établissements", "etablissements"],
    // [LateralMenuArretsLogo, "Arrêts", "arrets"],
    // [LateralMenuSettingsLogo, "Paramètres", "parametres"],
    // [LateralMenuSupportLogo, "Support", "support"],
  ];

  return (
    <nav id="lateral-nav" classList={{ active: getDisplayedMenu() }}>
      <div class="lateral-nav-header">
        <EnterpriseLogo />
      </div>

      <ul class="lateral-nav-list">
        <For each={menuItems}>
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
