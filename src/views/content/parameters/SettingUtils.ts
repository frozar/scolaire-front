import { SettingType, SettingsEnum } from "../../../_entities/parameter.entity";
import { setBufferParameters } from "./organism/SettingList";
import { getSettings, setSettings } from "./organism/Settings";

export namespace SettingUtils {
  export function getSetting(setting: SettingsEnum): SettingType {
    return getSettings().filter(
      (parameter_) => parameter_.setting == setting
    )[0];
  }

  export function updateSettings(setting: SettingType) {
    setSettings((prev) =>
      [...prev].map((setting_) => {
        if (setting_.setting == setting.setting) setting_.value = setting.value;
        return setting_;
      })
    );
  }

  export function updateBufferSettings(setting: SettingType) {
    setBufferParameters((prev) =>
      [...prev].map((setting_) => {
        if (setting_.setting == setting.setting) setting_.value = setting.value;
        return setting_;
      })
    );
  }
}
