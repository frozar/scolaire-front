import { SettingsEnum } from "../../../../_entities/setting.entity";
import InputNumber from "../../stops/component/atom/InputNumber";
import { SettingUtils } from "../SettingUtils";

import "./SettingItem.css";

interface SettingItemProps {
  settingName: SettingsEnum;
}

export function SettingItem(props: SettingItemProps) {
  return (
    <div class="setting-item">
      <p>{SettingUtils.getSettingTitle(props.settingName)}</p>

      <InputNumber
        placeholder={SettingUtils.getSettingTitle(props.settingName)}
        selector={{
          value: Number(SettingUtils.getSetting(props.settingName)?.value),
          disabled: false,
        }}
        onChange={(element) =>
          SettingUtils.getSettingCallback(props.settingName, element)
        }
      />
    </div>
  );
}
