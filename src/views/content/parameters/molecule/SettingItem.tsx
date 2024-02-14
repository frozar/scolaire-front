import { SettingsEnum } from "../../../../_entities/parameter.entity";
import CollapsibleElement from "../../board/component/organism/CollapsibleElement";
import InputNumber from "../../stops/component/atom/InputNumber";
import { ParameterUtils } from "../ParameterUtils";

interface SettingItemProps {
  settingName: SettingsEnum;
}

// * To add setting:
// * add switch matching into getSettingTitle & getSettingCallback for the new setting
export function SettingItem(props: SettingItemProps) {
  function onChangeWaitingTime(element: HTMLInputElement) {
    ParameterUtils.updateBufferParameters({
      setting: SettingsEnum.waintingTime,
      value: Number(element.value),
    });
  }

  function getSettingTitle(setting: SettingsEnum) {
    switch (setting) {
      case SettingsEnum.waintingTime:
        return "Temps d'attente";
      case SettingsEnum.param1:
        return "Paramètre 1";
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
      case SettingsEnum.param1:
        return (() => {
          console.log("callback pour param 1");
        })();
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
            ParameterUtils.getParameter(
              props.settingName
            )?.setting.toString() as string
          }
          selector={{
            value: ParameterUtils.getParameter(props.settingName)
              ?.value as number,
            disabled: false,
          }}
          onChange={(element) => getSettingCallback(props.settingName, element)}
        />
      </CollapsibleElement>
    </div>
  );
}
