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
    .then((blob) => {
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
      <div class="fixed bottom-0 right-0 p-2 m-4 mr-1 z-[999]">
        <button
          class="bg-white bg-opacity-90 border-none text-black
          hover:bg-white font-bold py-2 px-4 rounded btn"
          onClick={handleDownloadClick}
        >
          Exporter données GTFS
        </button>
      </div>
    </>
  );
}
