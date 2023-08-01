import { Accessor, JSX, Setter } from "solid-js";
import { PointInformation } from "./views/content/graphicage/component/atom/Point";
import { StopType } from "./_entities/stop.entity";

export type EleveVersEtablissementType = {
  id: number;
  quantity: number;
  ramassage_id: number;
  etablissement_id: number;
  etablissement_id_point: number;
  ramassage_id_point: number;
  etablissement: string;
  ramassage: string;
};

export enum NatureEnum {
  ramassage = "Ramassage",
  etablissement = "Etablissement",
}

//TODO to update or delete cause of Xano
export type PointIdentityType = {
  id: number;
  idPoint: number;
  nature: NatureEnum;
};

export type PointResourceType = PointIdentityType & {
  lon: number;
  lat: number;
  name: string;
  quantity: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  associatedPoints: Accessor<PointIdentityType[]>;
  setAssociatedPoints: Setter<PointIdentityType[]>;
};

export type PointRamassageType = PointResourceType;

export type PointEtablissementType = PointResourceType;

export type PointToDisplayType = {
  idPoint: number;
  name: string;
  quantity: number;
};

export function isPointRamassage(pt: { nature: NatureEnum }) {
  return pt.nature === NatureEnum.ramassage;
}

export function isPointEtablissement(pt: { nature: NatureEnum }) {
  return pt.nature === NatureEnum.etablissement;
}

export type LineUnderConstructionType = LineType & {
  etablissementSelected: PointInformation[];
  confirmSelection?: boolean;
  nextIndex: number;
};

export type LineType = {
  idBusLine: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  color: string;
  stops: PointIdentityType[];
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
  idBusLine: number | null;
};

export type removeRamassageConfirmationType = {
  displayed: boolean;
  item: StopType | null;
};

export type clearConfirmationType = {
  displayed: boolean;
};

export type ImportCsvBoxType = {
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
  metrics: {
    etablissement?: {
      total: number;
      success: number;
      failed: number;
      detail: string[];
    };
    ramassage?: {
      total: number;
      success: number;
      failed: number;
      detail: string[];
    };
    eleve_vers_etablissement?: {
      total: number;
      success: number;
      failed: number;
      detail: string[];
    };
  };
};

export type SelectedMenuType =
  | "graphicage"
  | "dashboard"
  | "ramassages"
  | "voirie"
  | "etablissements"
  | "parametres"
  | "support";

export type MenuItemType = {
  menuItem: SelectedMenuType;
  Logo: () => JSX.Element;
  label: string;
  isDisabled: boolean;
};

export type StopItemType = {
  id: number;
  name: string;
  quantity: number;
  nbLine: number;
  nbEtablissement: number;
  lon: number;
  lat: number;
  selected: boolean;
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

export type UserMapType = {
  id: number;
  name: string;
  isSelected: Accessor<boolean>;
  isActive: Accessor<boolean>;
  setIsSelected: Setter<boolean>;
  setIsActive: Setter<boolean>;
};
