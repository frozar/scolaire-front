import { createSignal, onMount } from "solid-js";
import {
  SettingType,
  SettingsEnum,
} from "../../../../_entities/parameter.entity";
import { SettingService } from "../../../../_services/setting.service";
import PageTitle from "../../../../component/atom/PageTitle";
import { SettingList } from "./SettingList";

export const [getSettings, setSettings] = createSignal<SettingType[]>([
  {
    setting: SettingsEnum.param1,
    value: 10,
  },
  {
    setting: SettingsEnum.waintingTime,
    value: 30,
  },
]);

// * To add a setting:
// * append enum in SettingsEnum & got to SettingItem component
export function Settings() {
  onMount(async () => {
    setSettings(await SettingService.all());
    console.log("Parameters", getSettings());
  });
  return (
    <div class="page-layout">
      <PageTitle title="Paramètres globaux" />
      <SettingList />
    </div>
  );
}
