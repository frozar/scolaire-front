import { Show } from "solid-js";
import Button from "../../../../component/atom/Button";
import { isSettingEditing, setIsSettingEditing } from "../organism/Settings";

import { SettingUtils } from "../SettingUtils";
import "./SettingEditActions.css";

export function SettingEditActions() {
  function onClickCancelEdit() {
    setIsSettingEditing(false);
  }

  function onClickSaveEdit() {
    setIsSettingEditing(false);
    SettingUtils.updateSettings();
  }

  return (
    <Show when={isSettingEditing()}>
      <div class="edit-setting-actions-footer">
        <Button label="Annuler" variant="danger" onClick={onClickCancelEdit} />
        <Button label="Valider" onClick={onClickSaveEdit} />
      </div>
    </Show>
  );
}
