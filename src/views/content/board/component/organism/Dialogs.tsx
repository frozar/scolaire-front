import { createSignal } from "solid-js";

import Dialog from "../molecule/Dialog";
import ImportDialogContent from "../molecule/importDialogContent";

export const [isImportDialogDisplayed, setIsImportDialogDisplayed] =
  createSignal<boolean>(false);

export default function () {
  return (
    <Dialog
      isDisplayed={isImportDialogDisplayed}
      setIsDisplayed={setIsImportDialogDisplayed}
    >
      <ImportDialogContent setIsDisplayed={setIsImportDialogDisplayed} />
    </Dialog>
  );
}
