import Button from "./atom/Button";
import { getToken } from "../auth/auth";
import { displayDownloadErrorMessage } from "../userInformation/utils";
import { download } from "../utils";
import { getTimestamp } from "../views/graphicage/rightMapMenu/export/utils";

function onClickHandler(exportRoute: string) {
  getToken()
    .then((token) => {
      fetch(import.meta.env.VITE_BACK_URL + exportRoute, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
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

          const { year, month, day, hour, minute, second } = getTimestamp();
          const fileName = `${year}-${month}-${day}_${hour}-${minute}-${second}_etablissement.csv`;
          download(fileName, blob);
        })
        .catch(() => {
          displayDownloadErrorMessage();
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

export default function (props: { exportRoute: string }) {
  return (
    <Button onClickHandler={() => onClickHandler(props.exportRoute)}>
      Exporter
    </Button>
  );
}
