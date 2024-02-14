import { createSignal, For } from "solid-js";
import {
  SettingsEnum,
  SettingType,
} from "../../../../_entities/parameter.entity";
import { SettingItem } from "../molecule/SettingItem";

export const [bufferSettings, setBufferSettings] = createSignal<SettingType[]>(
  []
);

export function TravelTimeSettings() {
  // * To append settings in Travel Time section please add the setting from SettingsEnum into travedTime var
  const travelTime = [SettingsEnum.waintingTime];

  return (
    <For each={Object.values(travelTime)}>
      {(settingName) => <SettingItem settingName={settingName} />}
    </For>
  );
}
