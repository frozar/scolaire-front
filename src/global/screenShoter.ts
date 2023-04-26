import {
  PluginOptions,
  SimpleMapScreenshoter,
} from "leaflet-simple-map-screenshoter";
import { getLeafletMap } from "./leafletMap";
import { TileLayer } from "leaflet";

let screenshoter: SimpleMapScreenshoter | null = null;

let pluginOptions: PluginOptions = {
  cropImageByInnerWH: false, // crop blank opacity from image borders
  hidden: true, // hide screen icon
  preventDownload: false, // prevent download on button click
  domtoimageOptions: {}, // see options for dom-to-image
  position: "topleft", // position of take screen icon
  screenName: "screen", // string or function
  iconUrl: "", // string or function
  hideElementsWithSelectors: [".leaflet-top", ".leaflet-right"],
  mimeType: "image/png", // used if format == image,
  caption: null, // string or function, added caption to bottom of screen
  captionFontSize: 15,
  captionFont: "",
  captionColor: "",
  captionBgColor: "",
  captionOffset: 5,
};

let waitForTiles: number = 0;

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

export function setOnLoadEvent() {
  const map = getLeafletMap();
  map.eachLayer((layer) => {
    if (layer instanceof TileLayer) {
      layer.once("tileloadstart", () => {
        console.log("tile loading " + waitForTiles);
        waitForTiles++;
      });
      layer.once("load", () => {
        console.log("tile loaded " + waitForTiles);
        waitForTiles--;
      });
    }
  });
}

export function unsetOnLoadEvent() {
  const map = getLeafletMap();
  map.eachLayer((layer) => {
    if (layer instanceof TileLayer) {
      layer.off("tileloadstart");
      layer.off("load");
    }
  });
}

export function waitTileLoading(): Promise<void> {
  return new Promise((resolve) => {
    if (waitForTiles === 0) {
      resolve();
    }
  });
}
