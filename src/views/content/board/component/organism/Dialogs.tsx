import { createSignal } from "solid-js";
import Dialog from "../molecule/Dialog";

export const [isImportDialogDisplayed, setIsImportDialogDisplayed] =
  createSignal<boolean>(false);

export default function () {
  return (
    <Dialog
      isDisplayed={isImportDialogDisplayed}
      setIsDisplayed={setIsImportDialogDisplayed}
    >
      <div>TEST</div>
    </Dialog>
  );
}
