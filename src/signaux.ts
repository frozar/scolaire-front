import L from "leaflet";
import { Signal, createSignal } from "solid-js";
import {
  ExportTypeEnum,
  ImportCsvBoxType,
  MessageLevelEnum,
  MessageTypeEnum,
  PointEtablissementType,
  PointRamassageType,
  ReturnMessageType,
  clearConfirmationType,
  exportConfirmationType,
  removeGradeConfirmationType,
  removeRamassageConfirmationType,
  userInformationType,
} from "./type";

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

// TODO: Delete when no longer used (replaced by stops and schools)
export const [points, setPoints] = createSignal<
  PointRamassageType[] | PointEtablissementType[]
>([]);

export const [getUserInformations, setUserInformations] = createSignal(
  []
) as Signal<userInformationType[]>;

export const [getImportCsvBox, setImportCsvBox] =
  createSignal<ImportCsvBoxType>({
    displayed: false,
  });

export const [getRemoveStopConfirmation, setRemoveStopConfirmation] =
  createSignal({
    displayed: false,
    item: null,
  }) as Signal<removeRamassageConfirmationType>;

export const [getRemoveGradeConfirmation, setRemoveGradeConfirmation] =
  createSignal({
    displayed: false,
    grade: null,
  }) as Signal<removeGradeConfirmationType>;

export const [
  displayedClearConfirmationDialogBox,
  setDisplayedClearConfirmationDialogBox,
] = createSignal<clearConfirmationType>({
  displayed: false,
});

const initialImportMessage: ReturnMessageType = {
  displayed: false,
  message: "",
  metrics: {},
};

export const [getImportConfirmation, setImportConfirmation] =
  createSignal<ReturnMessageType>(initialImportMessage);

export function closeDragAndDropConfirmationBox() {
  setImportConfirmation(initialImportMessage);
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

export function closeRemoveRamassageConfirmationBox() {
  setRemoveStopConfirmation({
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
    if (userInformation.type === MessageTypeEnum.enterAddTrip) {
      const doesContainEnterAddline =
        currentArray.filter((elt) => elt.type === MessageTypeEnum.enterAddTrip)
          .length != 0;

      if (doesContainEnterAddline) {
        return currentArray;
      }
    }

    const res = [
      ...currentArray,
      {
        ...userInformation,
        id: id,
      },
    ];

    return res;
  });
}

export function addNewGlobalWarningInformation(message: string) {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content: message,
  });
}

export function addNewGlobalSuccessInformation(message: string) {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.success,
    type: MessageTypeEnum.global,
    content: message,
  });
}

export function removeUserInformation(id: number) {
  setUserInformations((prevUserInformations) =>
    prevUserInformations.filter((userInformation) => userInformation.id != id)
  );
}

export const [getLeafletMap, setLeafletMap] = createSignal<L.Map>();
