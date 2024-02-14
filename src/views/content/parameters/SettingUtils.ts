import { SettingType, SettingsEnum } from "../../../_entities/parameter.entity";
import { SettingService } from "../../../_services/setting.service";
import { disableSpinningWheel, enableSpinningWheel } from "../../../signaux";
import { bufferSettings, setBufferSettings } from "./organism/SettingList";
import { getSettings, setSettings } from "./organism/Settings";

export namespace SettingUtils {
  export function getSetting(setting: SettingsEnum): SettingType {
    console.log("settings:", getSettings());

    return getSettings().filter(
      (parameter_) => parameter_.setting == setting
    )[0];
  }

  export async function updateSettings() {
    enableSpinningWheel();
    console.log("inital settings:", getSettings());
    console.log("buffer settings:", bufferSettings());

    setSettings(await SettingService.update(bufferSettings()));
    console.log("inital settings:", getSettings());

    disableSpinningWheel();
  }

  export function updateBufferSettings(setting: SettingType) {
    setBufferSettings((prev) =>
      [...prev].map((setting_) => {
        if (setting_.setting == setting.setting) setting_.value = setting.value;
        return setting_;
      })
    );
  }
}
