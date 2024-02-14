export enum SettingsEnum {
  waintingTime = "waitingTime",
}

export type SettingType = {
  setting: SettingsEnum;
  value: string | number;
};

export namespace SettingEntity {}
