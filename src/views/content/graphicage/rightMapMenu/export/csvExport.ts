import { useStateGui } from "../../../../../StateGui";
import {
  displayDownloadErrorMessage,
  displayDownloadSuccessMessage,
  displayOnGoingDownloadMessage,
} from "../../../../../userInformation/utils";
import { download } from "../../../../../utils";
import { authenticateWrap } from "../../../../layout/authentication";
import { getTimestamp } from "./utils";

const [, { getActiveMapId }] = useStateGui();

export function exportCsv() {
  displayOnGoingDownloadMessage();
  authenticateWrap((headers) => {
    fetch(
      import.meta.env.VITE_BACK_URL + `/map/${getActiveMapId()}/export/csv/zip`,
      {
        headers,
      }
    )
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
        const fileName = `${year}-${month}-${day}_${hour}-${minute}_input.zip`;
        download(fileName, blob);
        displayDownloadSuccessMessage();
      })
      .catch(() => {
        displayDownloadErrorMessage();
      });
  });
}
