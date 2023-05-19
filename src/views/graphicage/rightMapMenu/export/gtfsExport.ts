import { auth0Client } from "../../../../auth/auth";
import {
  displayDownloadErrorMessage,
  displayDownloadSuccessMessage,
  displayOnGoingDownloadMessage,
} from "../../../../userInformation/utils";
import { getExportDate } from "./export";

function download(fileame: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileame;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export function exportGtfs() {
  displayOnGoingDownloadMessage();
  auth0Client
    .getTokenSilently()
    .then((token) => {
      fetch(import.meta.env.VITE_BACK_URL + "/gtfs.zip", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            displayDownloadErrorMessage();
          } else {
            return response.blob();
          }
        })
        .then((blob: Blob | undefined) => {
          if (!blob) {
            return;
          }
          const { year, month, day, hour, minute } = getExportDate();
          const fileName = `${year}-${month}-${day}_${hour}-${minute}_gtfs.zip`;
          download(fileName, blob);
          displayDownloadSuccessMessage();
        })
        .catch(() => {
          displayDownloadErrorMessage();
        });
    })
    .catch((err) => {
      console.log(err);
      displayDownloadErrorMessage();
    });
}
