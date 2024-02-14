import { SettingType } from "../_entities/setting.entity";
import { ServiceUtils } from "./_utils.service";

export namespace SettingService {
  export async function all() {
    return await ServiceUtils.get("/settings");
  }

  export async function update(
    settings: SettingType[]
  ): Promise<SettingType[]> {
    const updatedSettings: SettingType[] = await ServiceUtils.patch(
      "/settings",
      { settings: settings }
    );

    return updatedSettings;
  }
}
