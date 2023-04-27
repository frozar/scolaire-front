import { LatLng, Polyline } from "leaflet";
import { getLeafletMap } from "../global/leafletMap";
import { getScreenshoter } from "../global/screenShoter";
import { getExportConfirmation } from "../signaux";
import { ExportTypeEnum, LineType } from "../type";
import {
  displayDownloadErrorMessage,
  displayDownloadSuccessMessage,
  displayOnGoingDownloadMessage,
} from "../userInformation/utils";
import { busLines } from "../signaux";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import { getBusLinePolyline, getLatLngs } from "../line/BusLinesFunction";
import { LatLngBounds } from "leaflet";

const exportHandlers = {
  [ExportTypeEnum.gtfs]: exportGtfs,
  [ExportTypeEnum.image]: exportImages,
};

function download(fileame: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileame;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
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
      displayDownloadSuccessMessage();
    })
    .catch(() => {
      displayDownloadErrorMessage();
    });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function moveEndEvent(
  map: L.Map,
  screenShoter: SimpleMapScreenshoter,
  bounds: LatLngBounds
): Promise<void> {
  return new Promise((resolve) => {
    map.once("moveend", async () => {
      await wait(500);
      screenShoter?.takeScreen("blob").then((blob: Blob) => {
        if (!blob) {
          displayDownloadErrorMessage();
          return;
        }
        download("map.png", blob);
      });
      await wait(500);
      resolve();
    });
    map.fitBounds(bounds, { padding: [50, 50] });
  });
}

function exportLine(
  line: L.Polyline,
  map: L.Map,
  screenShoter: SimpleMapScreenshoter
): Promise<void> {
  return new Promise(async (resolve) => {
    await moveEndEvent(map, screenShoter, line.getBounds());
    resolve();
  });
}

async function exportLinesImages(
  screenshoter: SimpleMapScreenshoter,
  lines: L.Polyline[],
  map: L.Map
) {
  for (const line of lines) {
    line.getElement()?.classList.remove("hidden");
    await exportLine(line, map, screenshoter);
    line.getElement()?.classList.add("hidden");
  }
  lines.map((line) => line.getElement()?.classList.remove("hidden"));
}

function exportMapImage(screenShoter: SimpleMapScreenshoter, map: L.Map) {
  map.once("moveend", async () => {
    await wait(250);
    screenShoter
      ?.takeScreen("blob")
      .then((blob: Blob) => {
        if (!blob) {
          displayDownloadErrorMessage();
          return;
        }
        download("map.png", blob);
      })
      .catch(() => {
        displayDownloadErrorMessage();
      });
  });

  map.setView([-20.930746, 55.527503], 13);
}

function exportImages() {
  // const lines = busLines();
  const screenShoter = getScreenshoter() as SimpleMapScreenshoter;
  const map = getLeafletMap();
  const polylines: Polyline[] = [];
  map.eachLayer((layer) => {
    if (layer instanceof Polyline) {
      layer.getElement()?.classList.add("hidden");   
      polylines.push(layer);
    }
  });
  
  // const polylines = lines.map((line) => getBusLinePolyline(line.color, getLatLngs(line.stops)));
  // const currentViewPos: LatLng = map.getCenter();
  // const currentViewZoom: number = map.getZoom();
  exportLinesImages(screenShoter, polylines, map);
  // polylines.forEach((line) => line.getElement()?.classList.remove("hidden"));
  // map.setView(
  //   [currentViewPos?.lat ?? 0, currentViewPos?.lng ?? 0],
  //   currentViewZoom ?? 0
  // );

}

export function exportData() {
  const exportType = () => getExportConfirmation()["exportType"];
  const type = exportType();
  if (!type && type !== ExportTypeEnum.gtfs) {
    return;
  }
  exportHandlers[type]();
}
