import { Match, Switch } from "solid-js";
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
    </>
  );
}
