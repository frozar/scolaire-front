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
    setSettings(await SettingService.update(bufferSettings() as SettingType[]));
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
      setting: SettingsEnum.waintingTime,
      value: element.value,
    });
  }

  export function getSettingTitle(setting: SettingsEnum) {
    switch (setting) {
      case SettingsEnum.waintingTime:
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
      case SettingsEnum.waintingTime:
        return onChangeWaitingTime(htmlElement as HTMLInputElement);
    }
  }
}
