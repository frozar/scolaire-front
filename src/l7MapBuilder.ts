import { createEffect } from "solid-js";

import L from "leaflet";
import { L7Layer } from "@antv/l7-leaflet";
import { getLeafletMap, setLeafletMap } from "./global/leafletMap";
import { enableSpinningWheel, disableSpinningWheel } from "./signaux";

import { useStateAction } from "./StateAction";
import FlaxibMapLogo from "./FlaxibMapLogo";
import { Stadia_AlidadeSmooth } from "./constant";
import { useStateGui } from "./StateGui";
import { getTileByName } from "./tileUtils";

const [state, { setOnTile }] = useStateGui();
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

  setLeafletMap(
    L.map(div, {
      zoomControl: false,
      zoomSnap: 0.1,
      zoomDelta: 0.1,
      minZoom: 10,
      wheelPxPerZoomLevel: 200,
    }).setView([-20.930746, 55.527503], 13)
  );

  // TODO: give the choice of different ground map to the user.
  // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
  // https://leaflet-extras.github.io/leaflet-providers/preview/
  // const readTile = OpenStreetMap_Mapnik;
  var readTile = Stadia_AlidadeSmooth;
  let tileLayer = readTile;

  if (!state.onTile || state.onTile == "" || state.onTile === undefined) {
    setOnTile("Stadia_AlidadeSmooth");
  } else {
    tileLayer = getTileByName(state.onTile).tile;
    readTile = getTileByName(state.onTile).tile;
  }

  // const readTile = Stadia_Outdoors;
  // const readTile = Esri_WorldTopoMap;
  // const readTile = CyclOSM;
  // const readTile = OpenStreetMap_CH;
  // const readTile = OpenStreetMap_HOT;
  // const readTile = OpenStreetMap_France;

  const editTile = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  );

  getLeafletMap().removeLayer(tileLayer);
  tileLayer.addTo(getLeafletMap());

  createEffect(() => {
    tileLayer.remove();
    if (isInReadMode()) {
      tileLayer = readTile;
    } else {
      tileLayer = editTile;
    }
    tileLayer.addTo(getLeafletMap());
  });

  addLogoFlaxib(getLeafletMap());

  // If a line is under construction, disable the possibility
  // to pan the map
  createEffect(() => {
    const dragging = getLeafletMap().dragging;
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
  l7layer.addTo(getLeafletMap());

  const scene = l7layer.getScene();

  // Remove the L7 logo
  scene.removeControl(scene.getControlByName("logo"));

  // To retrieve control over the cursor, remove the 'l7-interactive' class
  scene.getMapCanvasContainer().classList.remove("l7-interactive");
  disableSpinningWheel();
}
