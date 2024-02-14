import { createSignal } from "solid-js";
import { SettingType } from "../../../../_entities/parameter.entity";
import PageTitle from "../../../../component/atom/PageTitle";
import PencilIcon from "../../../../icons/PencilIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { SettingEditActions } from "../molecule/SettingEditActions";
import { SettingList } from "./SettingList";

export const [getSettings, setSettings] = createSignal<SettingType[]>([]);
export const [isSettingEditing, setIsSettingEditing] = createSignal(false);

// * To add a setting:
// * append enum in SettingsEnum & got to SettingItem component
export function Settings() {
  function onClickEditSettings() {
    setIsSettingEditing(true);
  }

  return (
    <div class="page-layout">
      <div class="flex justify-between">
        <PageTitle title="Paramètres globaux" />
        <ButtonIcon
          icon={<PencilIcon />}
          onClick={onClickEditSettings}
          disable={isSettingEditing()}
        />
      </div>
      <SettingList />
      <SettingEditActions />
    </div>
  );
}
