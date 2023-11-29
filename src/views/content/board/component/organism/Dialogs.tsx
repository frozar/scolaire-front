import { Match, Switch, createSignal } from "solid-js";

import { Dialog } from "../molecule/Dialog";
import { ImportDiff } from "../molecule/ImportDiff";
import { ImportDiffStudent } from "../molecule/ImportDiffStudents";
import { ImportSelection } from "../molecule/ImportSelection";

export enum DialogToDisplayEnum {
  none,
  typeSelection,
  diff,
  studentDiff,
}

export const [dialogToDisplay, setDialogToDisplay] =
  createSignal<DialogToDisplayEnum>(DialogToDisplayEnum.none);

export function Dialogs() {
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
            <ImportDiff />
          </Dialog>
        </Match>

        <Match when={dialogToDisplay() == DialogToDisplayEnum.studentDiff}>
          <Dialog>
            <ImportDiffStudent />
          </Dialog>
        </Match>
      </Switch>
    </>
  );
}
