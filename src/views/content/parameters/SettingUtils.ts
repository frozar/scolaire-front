import { SettingType, SettingsEnum } from "../../../_entities/setting.entity";
import { SettingService } from "../../../_services/setting.service";
import { disableSpinningWheel, enableSpinningWheel } from "../../../signaux";
import {
  bufferSettings,
  getSettings,
  setBufferSettings,
  setSettings,
} from "./organism/Settings";

export namespace SettingUtils {
  export function getSetting(setting: SettingsEnum): SettingType {
    return getSettings().filter(
      (parameter_) => parameter_.setting == setting
    )[0];
  }

  export async function updateSettings() {
    enableSpinningWheel();
    console.log("before update:", bufferSettings());

    const data = await SettingService.update(bufferSettings() as SettingType[]);
    console.log("data:", data);

    setSettings(data);
    disableSpinningWheel();
  }

  export function updateBufferSettings(setting: SettingType) {
    setBufferSettings((prev) => {
      if (!prev) return prev;
      return [...prev].map((setting_) => {
        if (setting_.setting == setting.setting) setting_.value = setting.value;
        return setting_;
      });
    });
  }

  export function onChangeWaitingTime(element: HTMLInputElement) {
    SettingUtils.updateBufferSettings({
      setting: SettingsEnum.waitingTime,
      value: element.value ? element.value : "0",
    });
  }

  export function getSettingTitle(setting: SettingsEnum) {
    switch (setting) {
      case SettingsEnum.waitingTime:
        return "Temps d'attente";
      default:
        return "";
    }
  }

  export function getSettingCallback(
    setting: SettingsEnum,
    htmlElement?: HTMLElement | HTMLInputElement
  ) {
    switch (setting) {
      case SettingsEnum.waitingTime:
        return onChangeWaitingTime(htmlElement as HTMLInputElement);
    }
  }

  export function isValidSetting() {
    let isValid = true;
    bufferSettings()?.map((setting) => {
      if (!setting.value) isValid = false;
    });
    return isValid;
  }
}
