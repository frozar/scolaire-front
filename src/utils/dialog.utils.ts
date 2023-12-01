import { setCsvType } from "../views/content/board/component/molecule/ImportSelection";
import {
  DialogToDisplayEnum,
  setDialogToDisplay,
} from "../views/content/board/component/organism/Dialogs";

export namespace DialogUtils {
  export function closeDialog() {
    setDialogToDisplay(DialogToDisplayEnum.none);
    // TODO: No need to use that when closeDialog() is used for other dialog than these linked to import
    setCsvType();
  }
}
