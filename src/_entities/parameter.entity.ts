export enum SettingsEnum {
  waintingTime = "waitingTime",
  param1 = "param1",
}

export type SettingType = {
  setting: SettingsEnum;
  value: string | number;
};

export namespace SettingEntity {}
