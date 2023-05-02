import JSZip from "jszip";
import { LatLng, LatLngBounds, Polyline } from "leaflet";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import { displayDownloadSuccessMessage } from "../userInformation/utils";
import { getScreenshoter } from "../global/screenShoter";
import { getLeafletMap } from "../global/leafletMap";
import { saveAs } from "file-saver";
import { enableSpinningWheel } from "../signaux";
import { disableSpinningWheel } from "../signaux";

let zip: JSZip;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

let i = 0;

function addImageProcess(c: any): Promise<void> {
  return new Promise<void>((resolve) => {
    let canvas = c as HTMLCanvasElement;

    canvas.toBlob(function (blob) {
      zip.file("line" + i++ + ".png", blob as Blob);
      resolve();
    });
  });
}

function moveEndEvent(
  map: L.Map,
  screenShoter: SimpleMapScreenshoter,
  bounds: LatLngBounds
): Promise<void> {
  return new Promise((resolve) => {
    map.once("moveend", async () => {
      //TODO : change the way we wait for the map to be loaded
      await wait(500);
      screenShoter?.takeScreen("canvas").then(async (canvas) => {
        addImageProcess(canvas as Blob).then(() => {
          resolve();
        });
      });
    });
    map.fitBounds(bounds, { padding: [30, 30] });
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

async function exportMapImage(
  screenShoter: SimpleMapScreenshoter,
  map: L.Map,
  lineBoundBox: LatLngBounds
) {
  await moveEndEvent(map, screenShoter, lineBoundBox);
}

function getLinesBoundBox(lines: L.Polyline[]): LatLngBounds {
  const linesBoundBox = lines.reduce(
    (bounds, line) => bounds.extend(line.getBounds()),
    new LatLngBounds([])
  );
  return linesBoundBox;
}

export async function exportImages() {
  const screenShoter = getScreenshoter() as SimpleMapScreenshoter;
  const map = getLeafletMap();
  let lineBoundBox: LatLngBounds = new LatLngBounds([0, 0], [0, 0]);
  const polylines: Polyline[] = [];
  const currentViewPos: LatLng = map.getCenter();
  const currentViewZoom: number = map.getZoom();

  zip = new JSZip();
  map.eachLayer((layer) => {
    if (layer instanceof Polyline) {
      polylines.push(layer);
    }
  });
  lineBoundBox = getLinesBoundBox(polylines);
  enableSpinningWheel();
  await exportMapImage(screenShoter, map, lineBoundBox);
  polylines.map((line) => line.getElement()?.classList.add("hidden"));
  await exportLinesImages(screenShoter, polylines, map);
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "bus_lines.zip");
    displayDownloadSuccessMessage();
  });
  disableSpinningWheel();
  map.setView(
    [currentViewPos?.lat ?? 0, currentViewPos?.lng ?? 0],
    currentViewZoom ?? 0
  );
}
