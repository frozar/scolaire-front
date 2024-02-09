import { PathEntity, PathType } from "../_entities/path.entity";
import { PathService } from "../_services/path.service";
import {
  drawTripCheckableGrade,
  setDrawTripCheckableGrade,
} from "../views/content/board/component/organism/DrawTripBoard";
import { changeBoard } from "../views/content/board/component/template/ContextManager";
import { quitModeDrawTrip } from "../views/content/map/shortcut";
import {
  DrawPathStep,
  currentDrawPath,
  onDrawPathStep,
  setCurrentDrawPath,
  setOnDrawPathStep,
} from "../views/content/path/component/drawPath.utils";
import { ContextUtils } from "./contextManager.utils";
import { PathUtil } from "./path.utils";

export namespace PathContextManagerUtil {
  export async function nextStep() {
    switch (onDrawPathStep()) {
      case DrawPathStep.schoolSelection:
        if ((currentDrawPath()?.schools.length ?? 0) < 1) break;
        setOnDrawPathStep(DrawPathStep.gradeSelection);
        break;

      case DrawPathStep.gradeSelection:
        const grades = drawTripCheckableGrade()
          .filter((grade) => grade.done)
          .map((grade) => grade.item.id);

        setCurrentDrawPath((path) => (!path ? path : { ...path, grades }));
        setOnDrawPathStep(DrawPathStep.editPath);
        break;

      case DrawPathStep.editPath:
        if (!PathUtil.isValidPath(currentDrawPath())) break;
        if (currentDrawPath()?.id) {
          await PathUtil.update(currentDrawPath() as PathType);
        } else if (!currentDrawPath()?.id)
          await PathService.create(currentDrawPath() as PathType);

        quitModeDrawTrip();
        changeBoard("path-details");
        break;
    }
  }

  export function prevStep() {
    switch (onDrawPathStep()) {
      case DrawPathStep.schoolSelection:
        setCurrentDrawPath(PathEntity.defaultPath());
        quitModeDrawTrip();
        changeBoard("path-details");
        break;

      case DrawPathStep.gradeSelection:
        setOnDrawPathStep(DrawPathStep.schoolSelection);
        break;

      case DrawPathStep.editPath:
        if (drawTripCheckableGrade().length == 0) {
          const pathGrades = currentDrawPath()?.grades;

          ContextUtils.defineTripCheckableGrade();
          setDrawTripCheckableGrade((prev) => {
            return [...prev].map((checkable) => {
              if (pathGrades?.includes(checkable.item.id))
                checkable.done = true;
              return checkable;
            });
          });
        }

        setOnDrawPathStep(DrawPathStep.gradeSelection);
        break;
    }
  }
}
