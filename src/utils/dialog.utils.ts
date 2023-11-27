import {
  DialogToDisplayEnum,
  setDialogToDisplay,
} from "../views/content/board/component/organism/Dialogs";

export namespace DialogUtils {
  export function closeDialog() {
    setDialogToDisplay(DialogToDisplayEnum.none);
    // TODO: Fix
    // setCsvType();
  }
}
