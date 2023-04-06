import { Signal, createSignal } from "solid-js";
import {
  MessageLevelEnum,
  PointEtablissementType,
  PointRamassageType,
  removeConfirmationType,
  userInformationType,
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


export const [getUserInformations, setUserInformations] = createSignal([{
  id: -1,
  displayed: false,
  level: MessageLevelEnum.info,
  content: "",
}]) as Signal<userInformationType[]>;

export const [getRemoveConfirmation, setRemoveConfirmation] = createSignal({
  displayed: false,
  id_bus_line: null,
}) as Signal<removeConfirmationType>;

function generateUniqueID(): number {
  const id = Math.random();
  if (getUserInformations().filter((userInformation) => userInformation.id === id).length === 0) {
    return id;
  }
  return generateUniqueID();
}

export function addNewUserInformation(userInformation: userInformationType) {
  const id = generateUniqueID();
  setUserInformations((currentArray) => {
    return [...currentArray, {
      ...userInformation,
      id: id
    }];
  });
}
