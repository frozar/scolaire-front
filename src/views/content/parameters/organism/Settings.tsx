import _ from "lodash";
import { createEffect, createSignal, on } from "solid-js";
import {
  SettingType,
  SettingsEnum,
} from "../../../../_entities/setting.entity";
import PageTitle from "../../../../component/atom/PageTitle";
import CollapsibleElement from "../../board/component/organism/CollapsibleElement";
import { SettingEditActions } from "../molecule/SettingEditActions";
import { TravelTimeSettings } from "./TravelTimeSettings";

export const [getSettings, setSettings] = createSignal<SettingType[]>([
  { setting: SettingsEnum.waintingTime, value: "0" },
]);
export const [bufferSettings, setBufferSettings] = createSignal<SettingType[]>(
  // eslint-disable-next-line solid/reactivity
  _.cloneDeep(getSettings())
);

// * To add a setting:
// * append enum in SettingsEnum & got to SettingItem component
export function Settings() {
  createEffect(
    on(getSettings, () => setBufferSettings(_.cloneDeep(getSettings())))
  );

  return (
    <div class="page-layout">
      <div class="flex justify-between">
        <PageTitle title="Paramètres globaux" />
        <SettingEditActions />
      </div>

      <CollapsibleElement title="Temps de parcours">
        <TravelTimeSettings />
      </CollapsibleElement>
    </div>
  );
}
