import { Signal, createSignal } from "solid-js";
import {
  Line,
  MessageTypeEnum,
  NatureEnum,
  PointEtablissementType,
  PointIdentity,
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

export const [getUserInformations, setUserInformations] = createSignal(
  []
) as Signal<userInformationType[]>;

export const [getRemoveConfirmation, setRemoveConfirmation] = createSignal({
  displayed: false,
  id_bus_line: null,
}) as Signal<removeConfirmationType>;

function generateUniqueID(): number {
  const id = Math.random();
  if (
    getUserInformations().filter((userInformation) => userInformation.id === id)
      .length === 0
  ) {
    return id;
  }
  return generateUniqueID();
}

export function addNewUserInformation(
  userInformation: Omit<userInformationType, "id">
) {
  const id = generateUniqueID();
  setUserInformations((currentArray) => {
    if (userInformation.type === MessageTypeEnum.enterAddLine) {
      const doesContainEnterAddline =
        currentArray.filter((elt) => elt.type === MessageTypeEnum.enterAddLine)
          .length != 0;
      if (doesContainEnterAddline) {
        return currentArray;
      }
    }
    return [
      ...currentArray,
      {
        ...userInformation,
        id: id,
      },
    ];
  });
}

export const [busLines, setBusLines] = createSignal<Line[]>([]);

function randColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

export function fetchBusLines() {
  fetch(import.meta.env.VITE_BACK_URL + "/bus_lines")
    .then((res) => {
      return res.json();
    })
    .then(
      (
        res: {
          id_bus_line: number;
          color: string | null;
          stops: {
            id: number;
            id_point: number;
            nature: string;
          }[];
        }[]
      ) => {
        let lines: Line[] = res.map((line) => {
          const color = line.color ? "#" + line.color : randColor();
          const stopsWithNatureEnum = line.stops.map(
            (stop) =>
              ({
                ...stop,
                nature:
                  stop["nature"] === "ramassage"
                    ? NatureEnum.ramassage
                    : NatureEnum.etablissement,
              } as PointIdentity)
          );
          return { ...line, color, stops: stopsWithNatureEnum };
        });

        setBusLines(lines);
      }
    );
}
