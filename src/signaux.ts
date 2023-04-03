import { createSignal } from "solid-js";
import { PointEtablissementType, PointRamassageType } from "./type";
import { deepCopy } from "./utils";

const [getDisplayedSpinningWheel, setDisplayedSpinningWheel] =
  createSignal(false);

export const displayedSpinningWheel = getDisplayedSpinningWheel;

export function enableSpinningWheel() {
  setDisplayedSpinningWheel((currentBool) => {
    if (!currentBool) {
      return true;
    }
    return currentBool;
  });
}

export function disableSpinningWheel() {
  setDisplayedSpinningWheel((currentBool) => {
    if (currentBool) {
      return false;
    }
    return currentBool;
  });
}

type LineUnderConstructionType = { active: boolean };

export const [lineUnderConstructionState, setLineUnderConstructionState] =
  createSignal<LineUnderConstructionType>({
    active: false,
  });

const [getSelectedElement, setterSelectedElement] = createSignal<
  PointRamassageType | PointEtablissementType
>();

export const selectedElement = getSelectedElement;

export function setSelectedElement(
  value: PointRamassageType | PointEtablissementType
) {
  setterSelectedElement(deepCopy(value));
}
export const [points, setPoints] = createSignal<
    PointRamassageType[] | PointEtablissementType[]
  >([]);