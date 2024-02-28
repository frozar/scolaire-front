import { setCsvType } from "../views/content/board/component/molecule/ImportSelection";
import {
  DialogToDisplayEnum,
  setDialogToDisplay,
} from "../views/content/board/component/organism/Dialogs";
import { inDuplication, setInDucplication } from "./duplicate.utils";

export namespace DialogUtils {
  export function closeDialog() {
    if (inDuplication()) setInDucplication(false);
    setDialogToDisplay(DialogToDisplayEnum.none);
    // TODO: No need to use that when closeDialog() is used for other dialog than these linked to import
    setCsvType();
  }
}
