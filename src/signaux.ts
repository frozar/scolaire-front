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
  InfoPanelEnum,
  removeRamassageConfirmationType,
  ImportCsvBoxType,
} from "./type";
import { deepCopy } from "./utils";
import { User } from "@auth0/auth0-spa-js";
import { getToken } from "./views/layout/topMenu/authentication";

import {
  arrowAttachEvent,
  busLinePolylineAttachEvent,
  computeArrows,
  computePolyline,
} from "./views/content/graphicage/line/BusLinesFunction";

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

function randColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

export const [pickerColor, setPickerColor] = createSignal("");

export const linkBusLinePolyline: {
  [idBusLine: number]: {
    polyline: L.Polyline;
    arrows: L.Marker[];
    color: string;
  };
} = {};

export function fetchBusLines() {
  getToken()
    .then((token) => {
      fetch(import.meta.env.VITE_BACK_URL + "/bus_lines", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
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
            const lines: LineType[] = res.map((resLine) => {
              const color = resLine.color ? "#" + resLine.color : randColor();
              const stopsWithNatureEnum = resLine.stops.map(
                (stop) =>
                  ({
                    ...stop,
                    nature:
                      stop["nature"] === "ramassage"
                        ? NatureEnum.ramassage
                        : NatureEnum.etablissement,
                  } as PointIdentityType)
              );

              const lineWk: LineType = {
                idBusLine: resLine.id_bus_line,
                color: color,
                stops: stopsWithNatureEnum,
              };

              return lineWk;
            });

            setBusLines((previousLines) => {
              // Remove existing polylines and arrows
              const idLines = lines.map((line) => line.idBusLine);

              for (const previousLine of previousLines) {
                if (
                  !(previousLine.idBusLine in idLines) &&
                  linkBusLinePolyline[previousLine.idBusLine]
                ) {
                  const { polyline: previousPolyline, arrows: previousArrows } =
                    linkBusLinePolyline[previousLine.idBusLine];

                  previousPolyline.remove();
                  previousArrows.map((arrow) => arrow.remove());

                  delete linkBusLinePolyline[previousLine.idBusLine];
                }
              }

              for (const line of lines) {
                // 1. Calcul de la polyline, à vol d'oiseau ou sur route
                computePolyline(line.color, line.stops).then(
                  (busLinePolyline) => {
                    const polylineLatLngs =
                      busLinePolyline.getLatLngs() as L.LatLng[];
                    // 2. Calcul des fléches
                    const arrows = computeArrows(polylineLatLngs, line.color);

                    // 3.Attacher les events
                    busLinePolylineAttachEvent(
                      busLinePolyline,
                      line.idBusLine,
                      arrows
                    );

                    for (const arrow of arrows) {
                      arrowAttachEvent(
                        arrow,
                        busLinePolyline,
                        line.idBusLine,
                        arrows
                      );
                    }

                    // 4. Manage the display of buslines
                    if (line.idBusLine in linkBusLinePolyline) {
                      const {
                        polyline: previousPolyline,
                        arrows: previousArrows,
                      } = linkBusLinePolyline[line.idBusLine];
                      previousPolyline.remove();
                      previousArrows.map((arrow) => arrow.remove());
                    }

                    const leafletMap = getLeafletMap();
                    if (!leafletMap) {
                      delete linkBusLinePolyline[line.idBusLine];
                      return;
                    }

                    busLinePolyline.addTo(leafletMap);
                    for (const arrow of arrows) {
                      arrow.addTo(leafletMap);
                    }

                    // 5. Enregistrer dans linkBusLinePolyline
                    linkBusLinePolyline[line.idBusLine] = {
                      polyline: busLinePolyline,
                      arrows: arrows,
                      color: line.color,
                    };
                  }
                );
              }

              return lines;
            });
          }
        );
    })
    .catch((err) => {
      console.log(err);
    });
}

export const [getLeafletMap, setLeafletMap] = createSignal<L.Map>();

export const [busLineSelected, setBusLineSelected] = createSignal<number>(-1);

export const [infoToDisplay, setInfoToDisplay] = createSignal<InfoPanelEnum>();

export const [stopIds, setStopIds] = createSignal<number[]>([]);

export const [timelineStopNames, setTimelineStopNames] = createSignal<string[]>(
  []
);
