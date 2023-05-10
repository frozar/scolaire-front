import {
  EnterpriseLogo,
  OpenLateralMenuLogo,
  CloseLateralMenuLogo,
  LateMenuDashboardLogo,
} from "../export/Logos";
import { lateralMenuToggled } from "../signaux";
import { Show } from "solid-js";
import { useStateGui } from "../StateGui";

const [stateGui, { toggleDisplayedMenu, setSelectedTab }] = useStateGui();

export default function () {
  return (
    <nav id="lateral-nav" class={stateGui.displayedMenu}>
      <div class="lateral-nav-header">
        <EnterpriseLogo />
        <Show when={stateGui.displayedMenu}>
          <strong>FLAXIB</strong>
        </Show>
      </div>

      <ul class="lateral-nav-list">
        <li className="lateral-nav-item">
          <LateMenuDashboardLogo />
          <Show when={stateGui.displayedMenu == true}>Dashboard</Show>
        </li>
        <li className="lateral-nav-item">Graphicage</li>
        <li className="lateral-nav-item">Voirie</li>
        <li className="lateral-nav-item">Établissements</li>
        <li className="lateral-nav-item">Arrêts</li>
        <li className="lateral-nav-item">Paramètres</li>
        <li className="lateral-nav-item">Support</li>
      </ul>

      <button id="lateral-close" onclick={toggleDisplayedMenu}>
        <Show when={stateGui.displayedMenu} fallback={<OpenLateralMenuLogo />}>
          <CloseLateralMenuLogo />
        </Show>
      </button>
    </nav>
  );
}
