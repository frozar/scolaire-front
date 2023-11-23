import { Match, Switch, createSignal } from "solid-js";

import Dialog from "../molecule/Dialog";
import ImportDiffs from "../molecule/ImportDiffs";
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
      <Switch>
        <Match when={dialogToDisplay() == DialogToDisplayEnum.typeSelection}>
          <Dialog>
            <ImportTypeSelection />
          </Dialog>
        </Match>

        <Match when={dialogToDisplay() == DialogToDisplayEnum.diff}>
          <Dialog>
            <ImportDiffs />
          </Dialog>
        </Match>
      </Switch>
    </>
  );
}
