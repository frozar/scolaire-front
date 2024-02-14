import { SettingsEnum } from "../../../../_entities/parameter.entity";
import CollapsibleElement from "../../board/component/organism/CollapsibleElement";
import InputNumber from "../../stops/component/atom/InputNumber";
import { SettingUtils } from "../SettingUtils";
import { isSettingEditing } from "../organism/Settings";

interface SettingItemProps {
  settingName: SettingsEnum;
}

// * To add setting:
// * add switch matching into getSettingTitle & getSettingCallback for the new setting
export function SettingItem(props: SettingItemProps) {
  function onChangeWaitingTime(element: HTMLInputElement) {
    SettingUtils.updateBufferSettings({
      setting: SettingsEnum.waintingTime,
      value: Number(element.value),
    });
  }

  function getSettingTitle(setting: SettingsEnum) {
    switch (setting) {
      case SettingsEnum.waintingTime:
        return "Temps d'attente";
      default:
        return "";
    }
  }

  function getSettingCallback(
    setting: SettingsEnum,
    htmlElement?: HTMLElement | HTMLInputElement
  ) {
    switch (setting) {
      case SettingsEnum.waintingTime:
        return onChangeWaitingTime(htmlElement as HTMLInputElement);
      default:
        return (() => {
          console.log("nothing to do");
        })();
    }
  }

  return (
    <div class="setting-item">
      <CollapsibleElement title={getSettingTitle(props.settingName)}>
        <InputNumber
          placeholder={
            SettingUtils.getSetting(
              props.settingName
            )?.setting.toString() as string
          }
          selector={{
            value: SettingUtils.getSetting(props.settingName)?.value as number,
            disabled: isSettingEditing(),
          }}
          onChange={(element) => getSettingCallback(props.settingName, element)}
        />
      </CollapsibleElement>
    </div>
  );
}
