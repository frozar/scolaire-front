import { Match, Switch } from "solid-js";
import { PathContextManagerUtil } from "../../../../../utils/pathContextManager.utils";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import {
  DrawPathStep,
  currentDrawPath,
  onDrawPathStep,
} from "../drawPath.utils";
import { EditPathView } from "./EditPathView";

export function DrawPath() {
  console.log("current draw path:", currentDrawPath());

  return (
    <>
      <Switch>
        <Match when={onDrawPathStep() == DrawPathStep.schoolSelection}>
          {/* TODO */}
          school selection
        </Match>

        <Match when={onDrawPathStep() == DrawPathStep.gradeSelection}>
          {/* TODO */}
          grade selection
        </Match>

        <Match when={onDrawPathStep() == DrawPathStep.editPath}>
          <EditPathView />
        </Match>
      </Switch>

      {/* TODO: add board footer */}
      <BoardFooterActions
        nextStep={{
          callback: PathContextManagerUtil.nextStep,
          label:
            onDrawPathStep() == DrawPathStep.editPath ? "Valider" : "Suivant",
        }}
        previousStep={{
          callback: PathContextManagerUtil.prevStep,
          label:
            onDrawPathStep() === DrawPathStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </>
  );
}
