import _ from "lodash";
import { createEffect, createSignal, For } from "solid-js";
import {
  SettingsEnum,
  SettingType,
} from "../../../../_entities/parameter.entity";
import { SettingItem } from "../molecule/SettingItem";
import { getSettings } from "./Settings";

export const [bufferSettings, setBufferSettings] = createSignal<SettingType[]>(
  []
);

export function SettingList() {
  createEffect(() => setBufferSettings(_.cloneDeep(getSettings())));

  return (
    <For each={Object.values(SettingsEnum)}>
      {(settingName) => <SettingItem settingName={settingName} />}
    </For>
  );
}
