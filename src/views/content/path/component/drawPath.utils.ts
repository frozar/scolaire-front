import _ from "lodash";
import { createSignal } from "solid-js";
import { PathPointType, PathType } from "../../../../_entities/path.entity";
import {
  currentTripIndex,
  setCurrentTripIndex,
} from "../../board/component/organism/DrawTripBoard";

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
}
