import { Match, Switch, createSignal } from "solid-js";

import Dialog from "../molecule/Dialog";
import ImportDiffs from "../molecule/ImportDiffs";
import ImportSelection from "../molecule/importSelection";

export enum DialogToDisplayEnum {
  none,
  typeSelection,
  diff,
}

export const [dialogToDisplay, setDialogToDisplay] =
  createSignal<DialogToDisplayEnum>(DialogToDisplayEnum.none);

export default function () {
  return (
    <>
      <Switch>
        <Match when={dialogToDisplay() == DialogToDisplayEnum.typeSelection}>
          <Dialog>
            <ImportSelection />
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
