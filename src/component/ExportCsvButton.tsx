import Button from "./atom/Button";
import { authenticateWrap } from "../views/layout/authentication";
import { displayDownloadErrorMessage } from "../userInformation/utils";
import { download } from "../utils";
import { getTimestamp } from "../views/content/graphicage/rightMapMenu/export/utils";

function onClickHandler(exportRoute: string) {
  authenticateWrap((headers) => {
    fetch(import.meta.env.VITE_BACK_URL + exportRoute, {
      method: "GET",
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

        const { year, month, day, hour, minute, second } = getTimestamp();
        const fileName = `${year}-${month}-${day}_${hour}-${minute}-${second}_etablissement.csv`;
        download(fileName, blob);
      })
      .catch(() => {
        displayDownloadErrorMessage();
      });
  });
}

export default function (props: { exportRoute: string }) {
  return (
    <Button
      onClickHandler={() => onClickHandler(props.exportRoute)}
      label="Exporter"
    />
  );
}
