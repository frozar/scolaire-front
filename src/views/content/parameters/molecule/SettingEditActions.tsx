import Button from "../../../../component/atom/Button";
import { setIsSettingEditing } from "../organism/Settings";

export function SettingEditActions() {
  function onClickCancelEdit() {
    setIsSettingEditing(false);
  }

  function onClickSaveEdit() {
    setIsSettingEditing(false);
  }

  return (
    <div class="flex gap-2">
      <Button label="Annuler" variant="danger" onClick={onClickCancelEdit} />
      <Button label="Valider" onClick={onClickSaveEdit} />
    </div>
  );
}
