import { createSignal } from "solid-js";
import { PathType } from "../../../../_entities/path.entity";

export enum DrawPathStep {
  schoolSelection,
  gradeSelection,
  editPath,
}

export const [currentDrawPath, setCurrentDrawPath] = createSignal<PathType>();
export const [onDrawPathStep, setOnDrawPathStep] = createSignal<DrawPathStep>(
  DrawPathStep.schoolSelection
);

export namespace drawPathUtils {}
