import {
  displayOnGoingDownloadMessage,
  displayDownloadErrorMessage,
  displayDownloadSuccessMessage,
} from "../userInformation/utils";

function handleDownloadClick() {
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

export default function () {
  return (
    <>
      <div class="export-btn">
        <button
          onClick={handleDownloadClick}
        >
          Export
        </button>
      </div>
    </>
  );
}
