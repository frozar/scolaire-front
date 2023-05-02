import { createEffect, createSignal } from "solid-js";

import L from "leaflet";
import { L7Layer } from "@antv/l7-leaflet";
import {
  setLeafletMap,
  enableSpinningWheel,
  disableSpinningWheel,
} from "./signaux";

import { useStateAction } from "./StateAction";
import FlaxibMapLogo from "./FlaxibMapLogo";
import { useStateGui } from "./StateGui";
import { getTileById } from "./tileUtils";

const [, { getSelectedTile }] = useStateGui();
const [, { isInReadMode, isInAddLineMode }] = useStateAction();

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
    minZoom: 10,
    wheelPxPerZoomLevel: 200,
  }).setView([-20.930746, 55.527503], 13);

  setLeafletMap(leafletMap);

  // TODO: be able to choice different map in function of mode
  const readTile = () => {
    return getTileById(getSelectedTile()).tileContent;
  };

  const editTile = () => {
    return getTileById(getSelectedTile()).tileContent;
  };

  const [currentTileLayer, setCurrentTileLayer] = createSignal<
    L.TileLayer | undefined
  >();

  createEffect(() => {
    setCurrentTileLayer(() => {
      if (isInReadMode()) {
        return readTile();
      } else {
        return editTile();
      }
    });
  });

  createEffect(() => {
    currentTileLayer()?.remove();
    currentTileLayer()?.addTo(leafletMap);
  });

  addLogoFlaxib(leafletMap);

  // If a line is under construction, disable the possibility
  // to pan the map
  createEffect(() => {
    const dragging = leafletMap.dragging;
    if (dragging) {
      if (isInAddLineMode()) {
        dragging.disable();
      } else {
        dragging.enable();
      }
    }
  });

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
