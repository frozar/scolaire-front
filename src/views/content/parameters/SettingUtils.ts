import { SettingType, SettingsEnum } from "../../../_entities/parameter.entity";
import { SettingService } from "../../../_services/setting.service";
import { disableSpinningWheel, enableSpinningWheel } from "../../../signaux";
import { getSettings, setSettings } from "./organism/Settings";
import {
  bufferSettings,
  setBufferSettings,
} from "./organism/TravelTimeSettings";

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

  export function onChangeWaitingTime(element: HTMLInputElement) {
    SettingUtils.updateBufferSettings({
      setting: SettingsEnum.waintingTime,
      value: Number(element.value),
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
