import { createEffect, createSignal } from "solid-js";

import { L7Layer } from "@antv/l7-leaflet";
import L from "leaflet";
import {
  disableSpinningWheel,
  enableSpinningWheel,
  setLeafletMap,
} from "../../../signaux";

import { useStateGui } from "../../../StateGui";
import { MapElementUtils } from "../../../utils/mapElement.utils";
import {
  changeBoard,
  isInDrawMod,
  onBoard,
} from "../board/component/template/ContextManager";
import FlaxibMapLogo from "./FlaxibMapLogo";
import { initScreenshoter } from "./rightMapMenu/export/screenShoter";
import { getTileById } from "./tileUtils";

const [
  ,
  {
    getSelectedReadModeTile,
    getSelectedEditModeTile,
    setSelectedEditModeTile,
    setSelectedReadModeTile,
    getSelectedMenu,
  },
] = useStateGui();

export const [isOverMapItem, setIsOverMapItem] = createSignal(false);

function addLogoFlaxib(map: L.Map) {
  const logoControl = L.Control.extend({
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
    options: {
      position: "bottomleft",
    },

    onAdd: FlaxibMapLogo,
  });
  new logoControl().addTo(map);
}

export function buildMapL7(div: HTMLDivElement) {
  enableSpinningWheel();

  const leafletMap = L.map(div, {
    zoomControl: false,
    zoomSnap: 0.1,
    zoomDelta: 0.1,
    wheelPxPerZoomLevel: 200,
  }).setView([-20.930746, 55.527503], 13);

  setLeafletMap(leafletMap);

  // Check which map ground must be displayed
  const readTile = () => {
    return getTileById(getSelectedReadModeTile()).tileContent;
  };

  const editTile = () => {
    return getTileById(getSelectedEditModeTile()).tileContent;
  };

  const [currentTileLayer, setCurrentTileLayer] = createSignal<
    L.TileLayer | undefined
  >();

  createEffect(() => {
    // TODO delete the two setters and check why the tiles' default parameters are not respected and fix it
    setSelectedReadModeTile("OpenStreetMap_Mapnik");
    setSelectedEditModeTile("Esri_WorldTopoMap");

    setCurrentTileLayer(() => {
      if (!isInDrawMod()) {
        return readTile();
      } else {
        return editTile();
      }
    });
  });

  createEffect(() => {
    leafletMap.eachLayer(function (layer) {
      if (layer instanceof L.TileLayer) {
        layer.remove();
      }
    });
    currentTileLayer()?.remove();
    currentTileLayer()?.addTo(leafletMap);
  });

  leafletMap.addEventListener("click", () => {
    if (
      !isOverMapItem() &&
      onBoard() != "trip-draw" &&
      onBoard() != "line-add" &&
      onBoard() != "path-draw"
    ) {
      if (getSelectedMenu() != "voirie") {
        changeBoard("line");
      }
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  addLogoFlaxib(leafletMap);
  initScreenshoter();

  // The argument in the constructor of the 'L7Layer' is simply pass to
  // Leaflet Layer as options for the constructor
  const l7layer = new L7Layer({});
  l7layer.addTo(leafletMap);

  const scene = l7layer.getScene();

  // Remove the L7 logo
  scene.removeControl(scene.getControlByName("logo"));

  // To retrieve control over the cursor, remove the 'l7-interactive' class
  scene.getMapCanvasContainer().classList.remove("l7-interactive");
  disableSpinningWheel();
}
