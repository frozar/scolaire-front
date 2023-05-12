import { Signal, createSignal } from "solid-js";
import L from "leaflet";
import {
  ExportTypeEnum,
  LineType,
  MessageTypeEnum,
  NatureEnum,
  PointEtablissementType,
  PointIdentityType,
  PointRamassageType,
  exportConfirmationType,
  removeConfirmationType,
  userInformationType,
  ReturnMessageType,
  clearConfirmationType,
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

export const [getClearConfirmation, setClearConfirmation] = createSignal({
  displayed: false,
}) as Signal<clearConfirmationType>;

export const [getDragAndDropConfirmation, setDragAndDropConfirmation] =
  createSignal({
    displayed: false,
    message: "",
    metrics: { total: 0, success: 0 },
    error: { etablissement: [], ramassage: [] },
    success: { etablissement: [], ramassage: [] },
  }) as Signal<ReturnMessageType>;

export function closeDragAndDropConfirmationBox() {
  setDragAndDropConfirmation({
    displayed: false,
    message: "",
    error: { etablissement: [], ramassage: [] },
    success: { etablissement: [], ramassage: [] },
  });
}

export function openExportConfirmationBox() {
  setExportConfirmation((prev) => ({
    ...prev,
    displayed: true,
  }));
}

export function closeRemoveConfirmationBox() {
  setRemoveConfirmation({
    displayed: false,
    id_bus_line: null,
  });
}

export function openClearConfirmationBox() {
  setClearConfirmation((prev) => ({
    ...prev,
    displayed: true,
  }));
}

export function closeClearConfirmationBox() {
  setClearConfirmation({
    displayed: false,
  });
}

export const [getRemainingExport, setRemainingExport] = createSignal(0);
export function setExportType(exportType: string | null) {
  const type = ExportTypeEnum[exportType as keyof typeof ExportTypeEnum];
  setExportConfirmation((prev) => ({
    ...prev,
    exportType: type,
  }));
}

export const [getExportConfirmation, setExportConfirmation] = createSignal({
  displayed: false,
  exportType: null,
}) as Signal<exportConfirmationType>;

export function closeExportConfirmationBox() {
  setExportConfirmation({
    displayed: false,
    exportType: null,
  });
}

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

export function removeUserInformation(id: number) {
  setUserInformations((prevUserInformations) =>
    prevUserInformations.filter((userInformation) => userInformation.id !== id)
  );
}

export const [busLines, setBusLines] = createSignal<LineType[]>([]);

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
        let lines: LineType[] = res.map((line) => {
          const color = line.color ? "#" + line.color : randColor();
          const stopsWithNatureEnum = line.stops.map(
            (stop) =>
              ({
                ...stop,
                nature:
                  stop["nature"] === "ramassage"
                    ? NatureEnum.ramassage
                    : NatureEnum.etablissement,
              } as PointIdentityType)
          );
          return { ...line, color, stops: stopsWithNatureEnum };
        });
        setBusLines(lines);
      }
    );
}

export const [getLeafletMap, setLeafletMap] = createSignal<L.Map>();
