import { JSX } from "solid-js";

export type EleveVersEtablissementType = {
  id: number;
  quantity: number;
  ramassage_id: number;
  etablissement_id: number;
  etablissement_id_point: number;
  ramassage_id_point: number;
};

// TODO: Use string as value for enum
export enum NatureEnum {
  ramassage,
  etablissement,
}

export type PointRamassageType = {
  id: number;
  id_point: number;
  nature: NatureEnum;
  location: string;
  name: string;
  quantity: number;
};

export type PointEtablissementType = PointRamassageType;

export function isPointRamassage(pt: { nature: NatureEnum }) {
  return pt.nature === NatureEnum.ramassage;
}

export function isPointEtablissement(pt: { nature: NatureEnum }) {
  return pt.nature === NatureEnum.etablissement;
}

export type PointIdentityType = {
  id: number;
  id_point: number;
  nature: NatureEnum;
};

export type LineUnderConstructionType = {
  color: string;
  stops: PointIdentityType[];
};

export type LineType = LineUnderConstructionType & {
  id_bus_line: number;
};

export enum ModeEnum {
  read,
  addLine,
  removeLine,
}

export enum MessageTypeEnum {
  enterRemoveLine,
  enterAddLine,
  removeLine,
  addLine,
  global,
  clear,
}

export enum MessageLevelEnum {
  info,
  success,
  warning,
  error,
}

export enum ExportTypeEnum {
  gtfs,
  csv,
  image,
}

export type userInformationType = {
  id: number;
  displayed: boolean;
  level: MessageLevelEnum;
  type: MessageTypeEnum;
  content: string | JSX.Element;
};

export type removeConfirmationType = {
  displayed: boolean;
  id_bus_line: number | null;
};

export type removeRamassageConfirmationType = {
  displayed: boolean;
  item: StopLineItem | null;
};

export type clearConfirmationType = {
  displayed: boolean;
};

export type TileId =
  | "OpenStreetMap_Mapnik"
  | "Stadia_AlidadeSmooth"
  | "Stadia_AlidadeSmoothDark"
  | "Stadia_Outdoors"
  | "Esri_WorldTopoMap"
  | "CyclOSM"
  | "OpenStreetMap_CH"
  | "OpenStreetMap_HOT"
  | "OpenStreetMap_France";

export type TileType = {
  tileId: TileId;
  tileContent: L.TileLayer;
};

export type exportConfirmationType = {
  displayed: boolean;
  exportType: ExportTypeEnum | null;
};
export type ReturnMessageType = {
  displayed: boolean;
  message: string;
  metrics: { total: number; success: number };
  error: { etablissement: string[]; ramassage: string[] };
  success: { etablissement: string[]; ramassage: string[] };
};

export type SelectedMenuType =
  | "graphicage"
  | "dashboard"
  | "arrets"
  | "voirie"
  | "etablissements"
  | "parametres"
  | "support";

export type MenuItemType = {
  title: string;
  menuItem: SelectedMenuType;
  Logo: () => JSX.Element;
  displayText: boolean;
};

export enum InfoPanelEnum {
  point,
  line,
  edition,
  nothing,
}
export type StopItemType = {
  id: number;
  name: string;
  quantity: number;
  nbLine: number;
  nbEtablissement: number;
  lon: number;
  lat: number;
};

export type PolylineRouteType = {
  latlngs: L.LatLng[];
  busLine: LineType;
};

export type EtablissementItemType = {
  id: number;
  name: string;
  quantity: number;
  nbLine: number;
  lon: number;
  lat: number;
  selected: boolean;
};
