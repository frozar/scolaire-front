import _ from "lodash";
import { createSignal } from "solid-js";
import { PathPointType, PathType } from "../../../../_entities/path.entity";
import { addNewUserInformation } from "../../../../signaux";
import {
  MessageLevelEnum,
  MessageTypeEnum
} from "../../../../type";
import {
  currentTripIndex,
  setCurrentTripIndex,
} from "../../board/component/organism/DrawTripBoard";
import { getSelectedLine } from "../../map/component/organism/BusLines";

export enum DrawPathStep {
  schoolSelection,
  gradeSelection,
  editPath,
}

export const [currentDrawPath, setCurrentDrawPath] = createSignal<PathType>();
export const [onDrawPathStep, setOnDrawPathStep] = createSignal<DrawPathStep>(
  DrawPathStep.schoolSelection
);

export namespace drawPathUtils {
  export function addPointToPath(point: PathPointType) {
    setCurrentDrawPath((path: PathType | undefined) => {
      if (!path) return path;
      const points = path.points;
      if (!_.isEqual(points.at(-1), point)) {
        points.splice(currentTripIndex(), 0, point);
      }
      setCurrentTripIndex(points.length);
      return { ...path, points };
    });
  }

  export function removePoint(id: number) {
    const pointIds = getSelectedLine()
      ?.trips.flatMap((item) => item.tripPoints)
      .map((stop) => stop.id);

    if (pointIds?.includes(id)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "L'arrêt que vous souhaitez supprimer est utilisé dans certaines courses, donc il ne peut pas être supprimé.",
      });
      return;
    }

    setCurrentDrawPath((prev) => {
      if (!prev) return prev;
      return { ...prev, points: prev.points.filter((point) => point.id != id) };
    });
  }
}
