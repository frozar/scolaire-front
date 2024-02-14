import { SettingType, SettingsEnum } from "../../../_entities/parameter.entity";
import { setBufferParameters } from "./organism/SettingList";
import { getSettings, setSettings } from "./organism/Settings";

export namespace ParameterUtils {
  export function getParameter(parameter: SettingsEnum): SettingType {
    return getSettings().filter(
      (parameter_) => parameter_.setting == parameter
    )[0];
  }

  export function updateParameters(parameter: SettingType) {
    setSettings((prev) =>
      [...prev].map((parameter_) => {
        if (parameter_.setting == parameter.setting)
          parameter_.value = parameter.value;

        return parameter_;
      })
    );
  }

  export function updateBufferParameters(parameter: SettingType) {
    setBufferParameters((prev) =>
      [...prev].map((parameter_) => {
        if (parameter_.setting == parameter.setting)
          parameter_.value = parameter.value;

        return parameter_;
      })
    );
  }
}
