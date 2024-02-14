import _ from "lodash";
import { createEffect, createSignal, For } from "solid-js";
import {
  SettingsEnum,
  SettingType,
} from "../../../../_entities/parameter.entity";
import { SettingItem } from "../molecule/SettingItem";
import { getSettings } from "./Settings";

export const [bufferParameters, setBufferParameters] = createSignal<
  SettingType[]
>([]);

export function SettingList() {
  createEffect(() => setBufferParameters(_.cloneDeep(getSettings())));

  return (
    <For each={Object.values(SettingsEnum)}>
      {(settingName) => <SettingItem settingName={settingName} />}
    </For>
  );
}
