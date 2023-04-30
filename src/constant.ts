export const COLOR_LINE_UNDER_CONSTRUCTION = "#0000FF";
export const DEAD_COLOR = "#000000FF";

import L from "leaflet";
import { TileEnum } from "./type";

// https://wiki.openstreetmap.org/wiki/Raster_tile_providers
// https://leaflet-extras.github.io/leaflet-providers/preview/

// Manage map ground
export const OpenStreetMap_Mapnik = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

export const Stadia_AlidadeSmooth = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);

export const Stadia_Outdoors = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);

export const Esri_WorldTopoMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
  }
);

export const CyclOSM = L.tileLayer(
  "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution: "CyclOSM | Map data: © OpenStreetMap contributors",
  }
);

export const OpenStreetMap_CH = L.tileLayer(
  "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

export const OpenStreetMap_HOT = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
  }
);

export const OpenStreetMap_France = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
  {
    maxZoom: 20,
    attribution:
      '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

// TODO: add a type to check the content of this list
export const layerTilesList = [
  {
    tile_name: TileEnum.OpenStreetMap_Mapnik,
    tile: OpenStreetMap_Mapnik,
  },

  {
    tile_name: TileEnum.Stadia_AlidadeSmooth,
    tile: Stadia_AlidadeSmooth,
  },

  {
    tile_name: TileEnum.Stadia_Outdoors,
    tile: Stadia_Outdoors,
  },

  {
    tile_name: TileEnum.Esri_WorldTopoMap,
    tile: Esri_WorldTopoMap,
  },

  {
    tile_name: TileEnum.CyclOSM,
    tile: CyclOSM,
  },

  {
    tile_name: TileEnum.OpenStreetMap_CH,
    tile: OpenStreetMap_CH,
  },

  {
    tile_name: TileEnum.OpenStreetMap_HOT,
    tile: OpenStreetMap_HOT,
  },

  {
    tile_name: TileEnum.OpenStreetMap_France,
    tile: OpenStreetMap_France,
  },
];
