import { SettingType } from "../_entities/parameter.entity";
import { ServiceUtils } from "./_utils.service";

export namespace SettingService {
  export async function all() {
    const parameters: SettingType[] = await ServiceUtils.get("/settings");
    return parameters;
  }
}
