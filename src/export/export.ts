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
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gtfs.zip";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      displayDownloadSuccessMessage();
    })
    .catch(() => {
      displayDownloadErrorMessage();
    });
}

function exportMapImage() {
  const screenshoter = getScreenshoter();
  const map = getLeafletMap();
  map.setView([-20.930746, 55.527503], 13);
  screenshoter?.takeScreen("blob").then((blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map.png";
    a.click();
  }).catch(() => {
    displayDownloadErrorMessage();
  });

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
