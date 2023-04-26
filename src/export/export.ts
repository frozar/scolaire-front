import { LatLng } from "leaflet";
import { getLeafletMap } from "../global/leafletMap";
import {
  getScreenshoter, setOnLoadEvent, unsetOnLoadEvent, waitTileLoading,
} from "../global/screenShoter";
import { getExportConfirmation } from "../signaux";
import { ExportTypeEnum } from "../type";
import {
  displayDownloadErrorMessage,
  displayDownloadSuccessMessage,
  displayOnGoingDownloadMessage,
} from "../userInformation/utils";

const exportHandlers = {
  [ExportTypeEnum.gtfs]: exportGtfs,
  [ExportTypeEnum.image]: exportMapImage,
};

let currentViewPos: LatLng | null = null;
let currentViewZoom: number | null = null;

function download(fileame: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileame;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
  displayDownloadSuccessMessage();
}

function exportGtfs() {
  displayOnGoingDownloadMessage();
  fetch(import.meta.env.VITE_BACK_URL + "/gtfs.zip")
    .then((response) => {
      if (!response.ok) {
        displayDownloadErrorMessage();
      } else {
        return response.blob();
      }
    })
    .then((blob: Blob | undefined) => {
      if (!blob) {
        displayDownloadErrorMessage();
        return;
      }
      download("gtfs.zip", blob);
    })
    .catch(() => {
      displayDownloadErrorMessage();
    });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function exportMapImage() {
  displayOnGoingDownloadMessage();
  const screenshoter = getScreenshoter();
  const map = getLeafletMap();
  // setOnLoadEvent();

  map.once("moveend", async () => {
    // await waitTileLoading();
    await wait(250);
    // unsetOnLoadEvent();
    screenshoter
      ?.takeScreen("blob")
      .then((blob: Blob) => {
        if (!blob) {
          displayDownloadErrorMessage();
          return;
        }
        download("map.png", blob);
        map.setView([currentViewPos?.lat ?? 0, currentViewPos?.lng ?? 0], currentViewZoom ?? 0);
      })
      .catch(() => {
        displayDownloadErrorMessage();
      });
  });
  currentViewPos = map.getCenter();
  currentViewZoom = map.getZoom();
  map.setView([-20.930746, 55.527503], 13);
}

export function exportData() {
  const exportType = () => getExportConfirmation()["exportType"];
  const type = exportType();

  if (type === null || type === undefined) {
    return;
  }

  exportHandlers[type]();
}
