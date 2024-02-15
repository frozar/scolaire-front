import _ from "lodash";
import { createEffect, createSignal, on } from "solid-js";
import { SettingType } from "../../../../_entities/setting.entity";
import { SettingsHeader } from "../molecule/SettingsHeader";
import { SettingsContent } from "./SettingsContent";

export const [getSettings, setSettings] = createSignal<SettingType[]>([]);
export const [bufferSettings, setBufferSettings] =
  createSignal<SettingType[]>();

// * To add a setting:
// * append enum in SettingsEnum & got to SettingItem component
export function Settings() {
  createEffect(
    on(getSettings, () => setBufferSettings(_.cloneDeep(getSettings())))
  );

  return (
    <div class="page-layout">
      <SettingsHeader />

      <SettingsContent />
    </div>
  );
}
