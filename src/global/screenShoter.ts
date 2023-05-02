import {
  PluginOptions,
  SimpleMapScreenshoter,
} from "leaflet-simple-map-screenshoter";
import { getLeafletMap } from "../signaux";

let screenshoter: SimpleMapScreenshoter | null = null;

let pluginOptions: PluginOptions = {
  hidden: true,
  hideElementsWithSelectors: [".leaflet-top"],
  mimeType: "image/png",
};

export function setScreenshoter() {
  screenshoter = new SimpleMapScreenshoter(pluginOptions);
  const leafletMap = getLeafletMap();

  if(!leafletMap) {
    return;
  }
  screenshoter.addTo(leafletMap);
}

export function getScreenshoter(): SimpleMapScreenshoter | null {
  return screenshoter;
}
