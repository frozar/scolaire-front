import { For, Match, Switch } from "solid-js";
import { PathContextManagerUtil } from "../../../../../utils/pathContextManager.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import BoardTitle from "../../../board/component/atom/BoardTitle";
import SelectedSchool from "../../../board/component/atom/SelectedSchool";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { CheckableGradeListBySchool } from "../../../board/component/organism/CheckableGradeListBySchool";
import {
  drawTripCheckableGrade,
  setDrawTripCheckableGrade,
} from "../../../board/component/organism/DrawTripBoard";
import {
  DrawPathStep,
  currentDrawPath,
  onDrawPathStep,
} from "../drawPath.utils";
import { EditPathView } from "./EditPathView";

export function DrawPath() {
  const schools = () =>
    currentDrawPath()?.schools.map((school) => SchoolUtils.get(school));

  return (
    <>
      <Switch>
        <Match when={onDrawPathStep() == DrawPathStep.schoolSelection}>
          <SelectedSchool schoolSelected={schools() ?? []} />
        </Match>

        <Match when={onDrawPathStep() == DrawPathStep.gradeSelection}>
          <BoardTitle title={"Sélection des niveaux"} />
          <For each={schools()}>
            {(school) => {
              return (
                <CheckableGradeListBySchool
                  school={school}
                  displayQuantity={true}
                  checkableGrade={drawTripCheckableGrade}
                  setCheckableGrade={setDrawTripCheckableGrade}
                />
              );
            }}
          </For>
        </Match>

        <Match when={onDrawPathStep() == DrawPathStep.editPath}>
          <EditPathView />
        </Match>
      </Switch>

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
              : "Précédent",
        }}
      />
    </>
  );
}
