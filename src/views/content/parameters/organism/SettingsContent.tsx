import { Show } from "solid-js";
import CollapsibleElement from "../../board/component/organism/CollapsibleElement";
import { NoSettingsDefined } from "../atom/NoSettingsDefined";
import { getSettings } from "./Settings";
import { TravelTimeSettings } from "./TravelTimeSettings";

import "./SettingsContent.css";

export function SettingsContent() {
  return (
    <div class="settings-content">
      <Show when={getSettings().length > 0} fallback={<NoSettingsDefined />}>
        <CollapsibleElement title="Temps de parcours">
          <TravelTimeSettings />
        </CollapsibleElement>
      </Show>
    </div>
  );
}
