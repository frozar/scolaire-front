import { createSignal } from "solid-js";

import Dialog from "../molecule/Dialog";
import ImportDialogBis from "../molecule/importDialogBis";

export const [isImportDialogDisplayed, setIsImportDialogDisplayed] =
  createSignal<boolean>(false);

export default function () {
  return (
    <Dialog
      isDisplayed={isImportDialogDisplayed}
      setIsDisplayed={setIsImportDialogDisplayed}
    >
      <ImportDialogBis setIsDisplayed={setIsImportDialogDisplayed} />
    </Dialog>
  );
}
