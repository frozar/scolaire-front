import JSZip from "jszip";
import { LatLng, LatLngBounds, Polyline } from "leaflet";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import {
  displayDownloadSuccessMessage,
  displayNoLineMessage,
} from "../../../../userInformation/utils";
import { getScreenshoter } from "./screenShoter";
import { getLeafletMap } from "../../../../signaux";
import { saveAs } from "file-saver";
import { enableSpinningWheel } from "../../../../signaux";
import { disableSpinningWheel } from "../../../../signaux";
import { getTimestamp } from "./utils";

let zip: JSZip;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

let i = 0;

function addImageProcess(canvas: HTMLCanvasElement): Promise<void> {
  return new Promise<void>((resolve) => {
    canvas.toBlob(function (blob) {
      zip.file("line" + i++ + ".png", blob as Blob);
      resolve();
    });
  });
}

function moveEndEvent(
  leafletMap: L.Map,
  screenShoter: SimpleMapScreenshoter,
  bounds: LatLngBounds
): Promise<void> {
  return new Promise((resolve) => {
    leafletMap.once("moveend", async () => {
      await wait(2000);
      const canvasCandidate = await screenShoter?.takeScreen("canvas");
      console.log("yo");

      if (canvasCandidate instanceof HTMLCanvasElement) {
        console.log("lo");
        const canvas = canvasCandidate as any as HTMLCanvasElement;
        await addImageProcess(canvas);
        resolve();
      }
    });
    leafletMap.fitBounds(bounds, { padding: [30, 30] });
  });
}

function exportLine(
  line: L.Polyline,
  leafletMap: L.Map,
  screenShoter: SimpleMapScreenshoter
): Promise<void> {
  return new Promise(async (resolve) => {
    await moveEndEvent(leafletMap, screenShoter, line.getBounds());
    resolve();
  });
}

async function exportLinesImages(
  screenshoter: SimpleMapScreenshoter,
  lines: L.Polyline[],
  leafletMap: L.Map
) {
  for (const line of lines) {
    line.getElement()?.classList.remove("hidden");
    await exportLine(line, leafletMap, screenshoter);
    line.getElement()?.classList.add("hidden");
  }
  lines.map((line) => line.getElement()?.classList.remove("hidden"));
}

async function exportMapImage(
  screenShoter: SimpleMapScreenshoter,
  leafletMap: L.Map,
  lineBoundBox: LatLngBounds
) {
  await moveEndEvent(leafletMap, screenShoter, lineBoundBox);
}

function getLinesBoundBox(lines: L.Polyline[]): LatLngBounds {
  const linesBoundBox = lines.reduce(
    (bounds, line) => bounds.extend(line.getBounds()),
    new LatLngBounds([])
  );
  return linesBoundBox;
}

function getPolylines(leafletMap: L.Map): L.Polyline[] | null {
  const polylines: L.Polyline[] = [];

  leafletMap.eachLayer((layer) => {
    if (layer instanceof Polyline) {
      polylines.push(layer);
    }
  });
  if (polylines.length === 0) {
    displayNoLineMessage();
    return null;
  }
  return polylines;
}

export async function exportImages() {
  const screenShoter = getScreenshoter() as SimpleMapScreenshoter;
  const leafletMap = getLeafletMap();
  if (!leafletMap) {
    return;
  }
  let lineBoundBox: LatLngBounds = new LatLngBounds([0, 0], [0, 0]);
  const currentViewPos: LatLng = leafletMap.getCenter();
  const currentViewZoom: number = leafletMap.getZoom();
  zip = new JSZip();
  const polylines: Polyline[] | null = getPolylines(leafletMap);
  if (!polylines) {
    return;
  }

  lineBoundBox = getLinesBoundBox(polylines);
  enableSpinningWheel();
  await exportMapImage(screenShoter, leafletMap, lineBoundBox);
  console.log(polylines);
  polylines.map((line) => line.getElement()?.classList.add("hidden"));
  await exportLinesImages(screenShoter, polylines, leafletMap);
  zip.generateAsync({ type: "blob" }).then((content) => {
    const { year, month, day, hour, minute } = getTimestamp();
    const fileName = `${year}-${month}-${day}_${hour}-${minute}_bus-line.zip`;
    saveAs(content, fileName);
    displayDownloadSuccessMessage();
  });
  disableSpinningWheel();
  leafletMap.setView(
    [currentViewPos?.lat ?? 0, currentViewPos?.lng ?? 0],
    currentViewZoom ?? 0
  );
}
