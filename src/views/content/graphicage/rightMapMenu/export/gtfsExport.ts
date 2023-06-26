import { authenticateWrap } from "../../../../layout/topNav/authentication";
import {
  displayDownloadErrorMessage,
  displayDownloadSuccessMessage,
  displayOnGoingDownloadMessage,
} from "../../../../../userInformation/utils";
import { download } from "../../../../../utils";
import { getTimestamp } from "./utils";

export function exportGtfs() {
  displayOnGoingDownloadMessage();
  authenticateWrap((headers) => {
    fetch(import.meta.env.VITE_BACK_URL + "/export/gtfs", {
      headers,
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
        const { year, month, day, hour, minute } = getTimestamp();
        const fileName = `${year}-${month}-${day}_${hour}-${minute}_gtfs.zip`;
        download(fileName, blob);
        displayDownloadSuccessMessage();
      })
      .catch(() => {
        displayDownloadErrorMessage();
      });
  });
}
