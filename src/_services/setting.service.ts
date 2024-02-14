import { SettingType } from "../_entities/parameter.entity";
import { ServiceUtils } from "./_utils.service";

export namespace SettingService {
  export async function all() {
    return await ServiceUtils.get("/settings");
  }

  export async function update(settings: SettingType[]) {
    const updatedSettings = await ServiceUtils.patch("/settings", {
      settings: settings,
    });

    console.log("updated settings: ", updatedSettings);
    return updatedSettings;
  }
}
