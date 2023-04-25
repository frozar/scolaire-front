import { PluginOptions, SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import { getLeafletMap } from "./leafletMap";

let screenshoter: SimpleMapScreenshoter | null = null;

let pluginOptions: PluginOptions = {
  cropImageByInnerWH: false, // crop blank opacity from image borders
  hidden: true, // hide screen icon
  preventDownload: false, // prevent download on button click
  domtoimageOptions: {}, // see options for dom-to-image
  position: "topleft", // position of take screen icon
  screenName: "screen", // string or function
  iconUrl: "", // string or function
  hideElementsWithSelectors: [".leaflet-control-container"],
  mimeType: "image/png", // used if format == image,
  caption: null, // string or function, added caption to bottom of screen
  captionFontSize: 15,
  captionFont: "Arial",
  captionColor: "black",
  captionBgColor: "white",
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
