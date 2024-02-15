import { Show, createEffect, createSignal, on } from "solid-js";
import Button from "../../../../component/atom/Button";

import _ from "lodash";
import { SettingUtils } from "../SettingUtils";
import { bufferSettings, getSettings } from "../organism/Settings";
import "./SettingEditActions.css";

export function SettingEditActions() {
  const [isSettingEditing, setIsSettingEditing] = createSignal(false);

  createEffect(
    on(bufferSettings, () => {
      if (
        !_.isEqual(bufferSettings(), getSettings()) &&
        SettingUtils.isValidSetting()
      )
        setIsSettingEditing(true);
      else setIsSettingEditing(false);
    })
  );

  async function onClickSaveEdit() {
    await SettingUtils.updateSettings();
  }

  return (
    <Show when={isSettingEditing()}>
      <div class="edit-setting-actions-footer">
        <Button label="Enregistrer" onClick={onClickSaveEdit} />
      </div>
    </Show>
  );
}
