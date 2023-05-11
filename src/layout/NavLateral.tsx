import {
  EnterpriseLogo,
  OpenLateralMenuLogo,
  CloseLateralMenuLogo,
  LateralMenuDashboardLogo,
  LateralMenuGraphicageLogo,
  LateralMenuVoirieLogo,
  LateralMenuEtablissementLogo,
  LateralMenuArretsLogo,
  LateralMenuSettingsLogo,
  LateralMenuSupportLogo,
} from "../export/Logos";
import { Show, createEffect, onMount } from "solid-js";
import { useStateGui } from "../StateGui";
import { For } from "solid-js";

import logo from "../assets/favicon.ico";

const [
  stateGui,
  { toggleDisplayedMenu, setSelectedMenu, getSelectedMenu, getDisplayedMenu },
] = useStateGui();

function MenuItems(props: any) {
  const { title, logo, url } = props;

  const MenuOnClick = () => {
    setSelectedMenu(url);
  };

  document.addEventListener("DOMContentLoaded", function () {
    const item_el = document.getElementById("window_" + url);

    createEffect(() => {
      if (getSelectedMenu() == url) {
        item_el?.classList.add("active");
      } else {
        item_el?.classList.remove("active");
      }
    });
  });

  return (
    <li id={"window_" + url} class="lateral-nav-item" onclick={MenuOnClick}>
      {logo}
      <Show when={getDisplayedMenu() == true}>{title}</Show>
    </li>
  );
}

export default function () {
  // [ComponentsLogo, title, url]
  const menu_items = [
    // [LateralMenuDashboardLogo, "Dashboard", "dashboard"],
    [LateralMenuGraphicageLogo, "Graphicage", "graphicage"],
    // [LateralMenuVoirieLogo, "Voirie", "voirie"],
    // [LateralMenuEtablissementLogo, "Établissements", "etablissements"],
    // [LateralMenuArretsLogo, "Arrêts", "arrets"],
    // [LateralMenuSettingsLogo, "Paramètres", "parametres"],
    // [LateralMenuSupportLogo, "Support", "support"],
  ];

  return (
    <nav id="lateral-nav" class={getDisplayedMenu()}>
      <div class="lateral-nav-header">
        <img src={logo} alt="Flaxib logo" />
        <Show when={getDisplayedMenu()}>
          <strong>FLAXIB</strong>
        </Show>
      </div>

      <ul class="lateral-nav-list">
        <For each={menu_items}>
          {(item) => <MenuItems title={item[1]} logo={item[0]} url={item[2]} />}
        </For>
      </ul>

      <button
        id="lateral-close"
        onclick={toggleDisplayedMenu}
        class={getDisplayedMenu()}
      >
        <Show when={getDisplayedMenu()} fallback={<OpenLateralMenuLogo />}>
          <CloseLateralMenuLogo />
        </Show>
      </button>
    </nav>
  );
}
