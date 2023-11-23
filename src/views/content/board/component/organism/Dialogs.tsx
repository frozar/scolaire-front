import { Show, createSignal } from "solid-js";

import Dialog from "../molecule/Dialog";
import ImportTypeSelection from "../molecule/importTypeSelection";

export const [isImportDialogDisplayed, setIsImportDialogDisplayed] =
  createSignal<boolean>(false);

export default function () {
  return (
    <>
      // TODO: Change from show to switch ?
      <Show when={isImportDialogDisplayed()}>
        <Dialog
          // isDisplayed={isImportDialogDisplayed}
          setIsDisplayed={setIsImportDialogDisplayed}
        >
          <ImportTypeSelection setIsDisplayed={setIsImportDialogDisplayed} />
        </Dialog>
      </Show>
      {/* <Show when={isImportDialogDisplayed()}>
        <Dialog
          // isDisplayed={isImportDialogDisplayed}
          setIsDisplayed={setIsImportDialogDisplayed}
        >
          <ImportDialogContent setIsDisplayed={setIsImportDialogDisplayed} />
        </Dialog>
      </Show> */}
    </>
  );
}
