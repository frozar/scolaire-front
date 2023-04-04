import { JSX, Signal, createSignal } from "solid-js";
import {
  MessageLevelEnum,
  PointEtablissementType,
  PointRamassageType,
} from "./type";
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

export const [getUserInformation, setUserInformation] = createSignal({
  level: MessageLevelEnum.info,
  content: "",
}) as Signal<
  | { level: MessageLevelEnum; content: string }
  | { level: MessageLevelEnum; content: JSX.Element }
>;

export const [getRemoveConfirmation, setRemoveConfirmation] = createSignal({
  displayed: false,
  id_bus_line: null,
}) as Signal<
  | { displayed: boolean; id_bus_line: null }
  | { displayed: boolean; id_bus_line: number }
>;
