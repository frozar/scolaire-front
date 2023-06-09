import { Signal, createSignal } from "solid-js";
import L from "leaflet";
import {
  ExportTypeEnum,
  LineType,
  MessageTypeEnum,
  PointEtablissementType,
  PointRamassageType,
  exportConfirmationType,
  removeConfirmationType,
  userInformationType,
  ReturnMessageType,
  clearConfirmationType,
  InfoPanelEnum,
  removeRamassageConfirmationType,
  ImportCsvBoxType,
} from "./type";
import { deepCopy } from "./utils";
import { User } from "@auth0/auth0-spa-js";

const [getDisplayedSpinningWheel, setDisplayedSpinningWheel] =
  createSignal(false);

export const [isRamassageReady, setIsRamassageReady] = createSignal(false);

export const [isEtablissementReady, setIsEtablissementReady] =
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

export const [getAuthenticatedUser, setAuthenticatedUser] =
  createSignal<User>();

export const [authenticated, setAuthenticated] = createSignal(false);

export const [getRemoveConfirmation, setRemoveConfirmation] = createSignal({
  displayed: false,
  idBusLine: null,
}) as Signal<removeConfirmationType>;

export const [getImportCsvBox, setImportCsvBox] =
  createSignal<ImportCsvBoxType>({
    displayed: false,
  });

export const [getRemoveRamassageConfirmation, setRemoveRamassageConfirmation] =
  createSignal({
    displayed: false,
    item: null,
  }) as Signal<removeRamassageConfirmationType>;

export const [
  displayedClearConfirmationDialogBox,
  setDisplayedClearConfirmationDialogBox,
] = createSignal<clearConfirmationType>({
  displayed: false,
});

const initialImportCsvMessage: ReturnMessageType = {
  displayed: false,
  message: "",
  metrics: { total: 0, success: 0 },
  error: { etablissement: [], ramassage: [] },
  success: { etablissement: [], ramassage: [] },
};

export const [getImportConfirmation, setImportConfirmation] =
  createSignal<ReturnMessageType>(initialImportCsvMessage);

export function closeDragAndDropConfirmationBox() {
  setImportConfirmation(initialImportCsvMessage);
}

export function openExportConfirmationBox() {
  setExportConfirmationDialogBox((prev) => ({
    ...prev,
    displayed: true,
  }));
}

const [displayedGeneratorDialogBox, setDisplayedGeneratorDialogBox] =
  createSignal(false);

export function openGeneratorDialogBox() {
  setDisplayedGeneratorDialogBox(true);
}

export function closeGeneratorDialogBox() {
  setDisplayedGeneratorDialogBox(false);
}

export function getDisplayedGeneratorDialogBox() {
  return displayedGeneratorDialogBox();
}

export function closeImportCsvBox() {
  setImportCsvBox({
    displayed: false,
  });
}
export function openImportCsvBox() {
  setImportCsvBox({
    displayed: true,
  });
}

export function closeRemoveConfirmationBox() {
  setRemoveConfirmation({
    displayed: false,
    idBusLine: null,
  });
}
export function closeRemoveRamassageConfirmationBox() {
  setRemoveRamassageConfirmation({
    displayed: false,
    item: null,
  });
}

export function openClearConfirmationBox() {
  setDisplayedClearConfirmationDialogBox((prev) => ({
    ...prev,
    displayed: true,
  }));
}

export function closeClearConfirmationBox() {
  setDisplayedClearConfirmationDialogBox({
    displayed: false,
  });
}

export const [getRemainingExport, setRemainingExport] = createSignal(0);
export function setExportType(exportType: string | null) {
  const type = ExportTypeEnum[exportType as keyof typeof ExportTypeEnum];
  setExportConfirmationDialogBox((prev) => ({
    ...prev,
    exportType: type,
  }));
}

export const [getExportConfirmationDialogBox, setExportConfirmationDialogBox] =
  createSignal({
    displayed: false,
    exportType: null,
  }) as Signal<exportConfirmationType>;

export function closeExportConfirmationBox() {
  setExportConfirmationDialogBox({
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

export const [pickerColor, setPickerColor] = createSignal("");

export const linkBusLinePolyline: {
  [idBusLine: number]: {
    polyline: L.Polyline;
    arrows: L.Marker[];
    color: string;
  };
} = {};

export const [getLeafletMap, setLeafletMap] = createSignal<L.Map>();

export const [busLineSelected, setBusLineSelected] = createSignal<number>(-1);

export const [infoToDisplay, setInfoToDisplay] = createSignal<InfoPanelEnum>();

export const [timelineStopNames, setTimelineStopNames] = createSignal<string[]>(
  []
);
