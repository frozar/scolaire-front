import {
  PluginOptions,
  SimpleMapScreenshoter,
} from "leaflet-simple-map-screenshoter";
import { getLeafletMap } from "./leafletMap";

let screenshoter: SimpleMapScreenshoter | null = null;

let pluginOptions: PluginOptions = {
  cropImageByInnerWH: false,
  hidden: true,
  preventDownload: false,
  domtoimageOptions: {
  },
  position: "topleft",
  screenName: "screen",
  iconUrl: "",
  hideElementsWithSelectors: [".leaflet-top"],
  mimeType: "image/png",
  caption: null,
  captionFontSize: 15,
  captionFont: "",
  captionColor: "",
  captionBgColor: "",
  captionOffset: 5,
};

export function setScreenshoter() {
  const map = getLeafletMap();
  if (map === null || map === undefined) {
    console.log("map is null or undefined");
  }

  screenshoter = new SimpleMapScreenshoter(pluginOptions);
  screenshoter.addTo(getLeafletMap());
}

export function getScreenshoter(): SimpleMapScreenshoter | null {
  return screenshoter;
}
