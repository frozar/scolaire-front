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

const [stateGui, { toggleDisplayedMenu, setSelectedTab }] = useStateGui();

function MenuItems(props: any) {
  const { title, logo } = props;

  return (
    <li class="lateral-nav-item">
      {logo}
      <Show when={stateGui.displayedMenu == true}>{title}</Show>
    </li>
  );
}
export default function () {
  const menu_items = [
    [LateralMenuDashboardLogo, "Dashboard"],
    [LateralMenuGraphicageLogo, "Graphicage"],
    [LateralMenuVoirieLogo, "Voirie"],
    [LateralMenuEtablissementLogo, "Établissements"],
    [LateralMenuArretsLogo, "Arrêts"],
    [LateralMenuSettingsLogo, "Paramètres"],
    [LateralMenuSupportLogo, "Support"],
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
          {(item) => <MenuItems title={item[1]} logo={item[0]} />}
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
