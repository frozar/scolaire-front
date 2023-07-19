import { Accessor, JSX, Setter } from "solid-js";

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

export type PointRamassageType = {
  id: number;
  idPoint: number;
  nature: NatureEnum;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  associatedPoints: Accessor<PointIdentityType[]>;
  setAssociatedPoints: Setter<PointIdentityType[]>;
};

export type PointEtablissementType = PointRamassageType;

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

export type PointIdentityType = {
  id: number;
  idPoint: number;
  nature: NatureEnum;
};

export type LineUnderConstructionType = {
  color: string;
  stops: PointIdentityType[];
};

export type LineType = LineUnderConstructionType & {
  idBusLine: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
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
  item: StopItemType | null;
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

export type PointRamassageDBType = {
  id: number;
  id_point: number;
  nature: NatureEnum;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

export type PointEtablissementDBType = PointRamassageDBType;

export type PointRamassageCoreType = Omit<PointRamassageDBType, "id_point"> & {
  idPoint: number;
};
