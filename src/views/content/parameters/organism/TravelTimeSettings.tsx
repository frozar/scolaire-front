import { For } from "solid-js";
import { SettingsEnum } from "../../../../_entities/setting.entity";
import { SettingItem } from "../molecule/SettingItem";

export function TravelTimeSettings() {
  // * To append settings in Travel Time section please add the setting from SettingsEnum into travedTime var
  const travelTime = [SettingsEnum.waitingTime];

  return (
    <For each={Object.values(travelTime)}>
      {(settingName) => <SettingItem settingName={settingName} />}
    </For>
  );
}
