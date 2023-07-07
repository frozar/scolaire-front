import { displayDownloadErrorMessage } from "../userInformation/utils";
import { download } from "../utils";
import { getTimestamp } from "../views/content/graphicage/rightMapMenu/export/utils";
import { authenticateWrap } from "../views/layout/authentication";
import Button from "./atom/Button";

function onClickHandler(exportRoute: string, filename: string) {
  console.log("exportRoute", exportRoute);
  console.log("filename", filename);
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

        const fileName = `${year}-${month}-${day}_${hour}-${minute}-${second}_${filename}.csv`;
        download(fileName, blob);
      })
      .catch(() => {
        displayDownloadErrorMessage();
      });
  });
}

export default function (props: { exportRoute: string; filename: string }) {
  return (
    <Button
      onClickHandler={() => onClickHandler(props.exportRoute, props.filename)}
      label="Exporter"
    />
  );
}
