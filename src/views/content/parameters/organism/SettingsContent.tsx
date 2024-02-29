import { Show, createEffect } from "solid-js";
import CollapsibleElement from "../../board/component/organism/CollapsibleElement";
import { NoSettingsDefined } from "../atom/NoSettingsDefined";
import { getSettings } from "./Settings";
import { TravelTimeSettings } from "./TravelTimeSettings";

import { userMaps } from "../../../../_stores/map.store";
import Button from "../../../../component/atom/Button";
import { MapsUtils } from "../../../../utils/maps.utils";
import {
  BoudingBoxSettings,
  newBoundingBox,
  setNewBoundingBox,
} from "./BoudingBoxSettings";
import "./SettingsContent.css";

export function SettingsContent() {
  createEffect(() => {
    setNewBoundingBox(MapsUtils.getSelectedMap(userMaps())?.bounding_box);
    console.log("newBoundingBox", newBoundingBox());
  });

  return (
    <div class="settings-content">
      <Show when={getSettings().length > 0} fallback={<NoSettingsDefined />}>
        <CollapsibleElement title="Temps de parcours">
          <TravelTimeSettings />
        </CollapsibleElement>

        <CollapsibleElement title="Bounding Box">
          <BoudingBoxSettings />
        </CollapsibleElement>

        <Button
          onClick={() => {
            MapsUtils.updateMap({
              ...MapsUtils.getSelectedMap(userMaps()),
              bounding_box: newBoundingBox(),
            });
          }}
          label={"Enregistrer les modifications"}
          variant="primary"
          isDisabled={false}
        />
      </Show>
    </div>
  );
}
