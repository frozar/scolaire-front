import { SettingsEnum } from "../../../../_entities/parameter.entity";
import InputNumber from "../../stops/component/atom/InputNumber";
import { SettingUtils } from "../SettingUtils";
import { isSettingEditing } from "../organism/Settings";

import "./SettingItem.css";

interface SettingItemProps {
  settingName: SettingsEnum;
}

// * To add setting:
// * add switch matching into getSettingTitle & getSettingCallback for the new setting
export function SettingItem(props: SettingItemProps) {
  return (
    <div class="setting-item">
      <p>{SettingUtils.getSettingTitle(props.settingName)}</p>

      <InputNumber
        placeholder={
          SettingUtils.getSetting(
            props.settingName
          )?.setting.toString() as string
        }
        selector={{
          value: SettingUtils.getSetting(props.settingName)?.value as number,
          disabled: !isSettingEditing(),
        }}
        onChange={(element) =>
          SettingUtils.getSettingCallback(props.settingName, element)
        }
      />
    </div>
  );
}
