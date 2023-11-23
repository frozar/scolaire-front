import { Match, Switch, createSignal } from "solid-js";

import Dialog from "../molecule/Dialog";
import ImportTypeSelection from "../molecule/importTypeSelection";

export enum DialogToDisplayEnum {
  none,
  typeSelection,
  diff,
}

export const [dialogToDisplay, setDialogToDisplay] =
  createSignal<DialogToDisplayEnum>(DialogToDisplayEnum.none);

// export const [isImportDialogDisplayed, setIsImportDialogDisplayed] =
//   createSignal<boolean>(false);

export default function () {
  return (
    <>
      // TODO: Change from show to switch ?
      <Switch>
        <Match when={dialogToDisplay() == DialogToDisplayEnum.typeSelection}>
          <Dialog>
            <ImportTypeSelection />
          </Dialog>
        </Match>

        <Match when={dialogToDisplay() == DialogToDisplayEnum.diff}>
          <Dialog>
            <div>TEST</div>
          </Dialog>
        </Match>
      </Switch>
      {/* <Show when={isImportDialogDisplayed()}>
        <Dialog
          // isDisplayed={isImportDialogDisplayed}
          setIsDisplayed={setIsImportDialogDisplayed}
        >
          <ImportTypeSelection setIsDisplayed={setIsImportDialogDisplayed} />
        </Dialog>
      </Show> */}
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
