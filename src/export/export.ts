import { getLeafletMap } from "../global/leafletMap";
import { getScreenshoter } from "../global/screenShoter";
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function exportMapImage() {
  displayOnGoingDownloadMessage();
  const screenshoter = getScreenshoter();
  const map = getLeafletMap();

  map.once("moveend", async () => {
    await sleep(500);
    screenshoter
      ?.takeScreen("blob")
      .then((blob: Blob) => {
        download("map.png", blob);
      })
      .catch(() => {
        displayDownloadErrorMessage();
      });
  });
  map.setView([-20.930746, 55.527503], 13);
}

export function exportData() {
  const exportType = () => getExportConfirmation()["exportType"];
  const type = exportType();

  if (type === null || type === undefined) {
    console.log("no type");
    return;
  }

  exportHandlers[type]();
}
