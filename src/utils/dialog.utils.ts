import { setCsvType } from "../views/content/board/component/molecule/ImportSelection";
import {
  DialogToDisplayEnum,
  setDialogToDisplay,
} from "../views/content/board/component/organism/Dialogs";

export namespace DialogUtils {
  export function closeDialog() {
    setDialogToDisplay(DialogToDisplayEnum.none);
    setCsvType();
  }
}
