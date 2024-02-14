export enum SettingsEnum {
  waintingTime = "waitingTime",
}

export type SettingType = {
  id?: number;
  setting: SettingsEnum;
  value: string | number;
};

export namespace SettingEntity {}
