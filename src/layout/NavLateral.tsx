import {
  EnterpriseLogo,
  OpenLateralMenuLogo,
  CloseLateralMenuLogo,
  // LateralMenuDashboardLogo,
  LateralMenuGraphicageLogo,
  // LateralMenuVoirieLogo,
  // LateralMenuEtablissementLogo,
  // LateralMenuArretsLogo,
  // LateralMenuSettingsLogo,
  // LateralMenuSupportLogo,
} from "../export/Logos";
import { Show } from "solid-js";
import { useStateGui } from "../StateGui";
import { For } from "solid-js";

import { menuItemType } from "../type";

const [
  ,
  { toggleDisplayedMenu, setSelectedMenu, getSelectedMenu, getDisplayedMenu },
] = useStateGui();

function MenuItems(props: menuItemType) {
  const { Logo, title, menuItem: url } = props;

  const onClickHandler = () => {
    setSelectedMenu(url);
  };

  return (
    <li
      class="lateral-nav-item"
      classList={{ active: getSelectedMenu() === url }}
      onClick={onClickHandler}
    >
      <Logo />
      <Show when={getDisplayedMenu() == true}>{title}</Show>
    </li>
  );
}

export default function () {
  const menuItems: menuItemType[] = [
    {
      Logo: LateralMenuGraphicageLogo,
      title: "Graphicage",
      menuItem: "graphicage",
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
            const { Logo, title, menuItem } = menuItemArg;
            return <MenuItems Logo={Logo} title={title} menuItem={menuItem} />;
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
