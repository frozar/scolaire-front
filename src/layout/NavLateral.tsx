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
import { Show } from "solid-js";
import { useStateGui } from "../StateGui";
import { For } from "solid-js";

const [stateGui, { toggleDisplayedMenu }] = useStateGui();

function MenuItems(props: any) {
  const { title, logo, url } = props;
  const MenuOnClick = () => {
    window.location.href = url;
  };

  let url_basename = location.pathname.split("/");
  url_basename = url_basename[url_basename.length - 1];

  let _class = "lateral-nav-item";
  if (url_basename == url) {
    _class += " active";
  }

  return (
    <li class={_class} onclick={MenuOnClick}>
      {logo}
      <Show when={stateGui.displayedMenu == true}>{title}</Show>
      {/* <Show when={url_basename == url}>
        <div className="bubble-menu"></div>
      </Show> */}
    </li>
  );
}

export default function () {
  // [ComponentsLogo, title, url]
  const menu_items = [
    // [LateralMenuDashboardLogo, "Dashboard", "dashboard"],
    [LateralMenuGraphicageLogo, "Graphicage", ""],
    // [LateralMenuVoirieLogo, "Voirie", "voirie"],
    // [LateralMenuEtablissementLogo, "Établissements", "etablissements"],
    // [LateralMenuArretsLogo, "Arrêts", "arrets"],
    // [LateralMenuSettingsLogo, "Paramètres", "parametres"],
    // [LateralMenuSupportLogo, "Support", "support"],
  ];

  return (
    <nav id="lateral-nav" class={stateGui.displayedMenu}>
      <div class="lateral-nav-header">
        <EnterpriseLogo />
        <Show when={stateGui.displayedMenu}>
          <strong>FLAXIB</strong>
        </Show>
      </div>

      <ul class="lateral-nav-list">
        <For each={menu_items}>
          {(item) => <MenuItems title={item[1]} logo={item[0]} url={item[2]} />}
        </For>
      </ul>

      <button id="lateral-close" onclick={toggleDisplayedMenu}>
        <Show when={stateGui.displayedMenu} fallback={<OpenLateralMenuLogo />}>
          <CloseLateralMenuLogo />
        </Show>
      </button>
    </nav>
  );
}
