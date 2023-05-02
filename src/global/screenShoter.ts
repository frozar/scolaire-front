import {
  PluginOptions,
  SimpleMapScreenshoter,
} from "leaflet-simple-map-screenshoter";
import { getLeafletMap } from "./leafletMap";

let screenshoter: SimpleMapScreenshoter | null = null;

let pluginOptions: PluginOptions = {
  hidden: true,
  hideElementsWithSelectors: [".leaflet-top"],
  mimeType: "image/png",
};

export function setScreenshoter() {
  screenshoter = new SimpleMapScreenshoter(pluginOptions);
  screenshoter.addTo(getLeafletMap());
}

export function getScreenshoter(): SimpleMapScreenshoter | null {
  return screenshoter;
}
