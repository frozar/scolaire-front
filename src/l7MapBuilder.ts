import { createEffect } from "solid-js";

import L from "leaflet";
import { L7Layer } from "@antv/l7-leaflet";
import { getLeafletMap, setLeafletMap } from "./global/leafletMap";
import { enableSpinningWheel, disableSpinningWheel } from "./signaux";

import { useStateAction } from "./StateAction";
import FlaxibMapLogo from "./FlaxibMapLogo";

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

  setLeafletMap(getLeafletMap().setMaxBounds([
    [-20.79470809955418, 55.87654918250451],
    [-21.454888464989377, 55.13054515975808]
  ]))

  // Manage map ground
  const OpenStreetMap_Mapnik = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  const Stadia_AlidadeSmooth = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  );
  const Stadia_Outdoors = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }
  );
  const Esri_WorldTopoMap = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    }
  );
  const CyclOSM = L.tileLayer(
    "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    {
      maxZoom: 20,
      attribution: "CyclOSM | Map data: © OpenStreetMap contributors",
    }
  );
  const OpenStreetMap_CH = L.tileLayer(
    "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  const OpenStreetMap_HOT = L.tileLayer(
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }
  );
  const OpenStreetMap_France = L.tileLayer(
    "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    {
      maxZoom: 20,
      attribution:
        '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  // TODO: give the choice of different ground map to the user.
  // https://wiki.openstreetmap.org/wiki/Raster_tile_providers
  // https://leaflet-extras.github.io/leaflet-providers/preview/
  // const readTile = OpenStreetMap_Mapnik;
  const readTile = Stadia_AlidadeSmooth;
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

  let tileLayer = readTile;

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
