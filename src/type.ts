import { JSX } from "solid-js";

export type EleveVersEtablissementType = {
  id: number;
  quantity: number;
  ramassage_id: number;
  etablissement_id: number;
  etablissement_id_point: number;
  ramassage_id_point: number;
};

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
}

export enum MessageLevelEnum {
  info,
  success,
  warning,
  error,
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

export enum TileEnum {
  OpenStreetMap_Mapnik = "OpenStreetMap_Mapnik",
  Stadia_AlidadeSmooth = "Stadia_AlidadeSmooth",
  Stadia_Outdoors = "Stadia_Outdoors",
  Esri_WorldTopoMap = "Esri_WorldTopoMap",
  CyclOSM = "CyclOSM",
  OpenStreetMap_CH = "OpenStreetMap_CH",
  OpenStreetMap_HOT = "OpenStreetMap_HOT",
  OpenStreetMap_France = "OpenStreetMap_France",
}

export type TileType = {
  tileId: TileEnum;
  tileContent: L.TileLayer;
};
