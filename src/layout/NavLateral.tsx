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

  const onClickHandler = () => {
    setSelectedMenu(url);
  };

  return (
    <li
      id={"window_" + url}
      class="lateral-nav-item"
      classList={{ active: getSelectedMenu() === url }}
      onClick={onClickHandler}
    >
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

  createEffect(() => {
    const logo = document.getElementById("enterprise-logo-text");
    if (stateGui.displayedMenu) {
      logo.style.display = "block";
      console.log("okok", logo);
    } else {
      logo.style.display = "none";
    }
  });

  return (
    <nav id="lateral-nav" class={getDisplayedMenu()}>
      <div class="lateral-nav-header">
        <EnterpriseLogo />
      </div>

      <ul class="lateral-nav-list">
        <For each={menu_items}>
          {(item) => <MenuItems title={item[1]} logo={item[0]} url={item[2]} />}
        </For>
      </ul>

      <button id="lateral-close" onclick={toggleDisplayedMenu}>
        <Show when={getDisplayedMenu()} fallback={<OpenLateralMenuLogo />}>
          <CloseLateralMenuLogo />
        </Show>
      </button>
    </nav>
  );
}
