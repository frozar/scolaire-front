import { Accessor, JSX, Setter } from "solid-js";
import { CourseType } from "./_entities/course.entity";
import { StopType } from "./_entities/stop.entity";
import { PointType } from "./views/content/map/component/atom/Point";

export enum NatureEnum {
  //TODO to delete and dependence
  ramassage = "Ramassage",
  //TODO to delete and dependence
  etablissement = "Etablissement",
  stop = "stop",
  school = "school",
}

//TODO to  delete cause of Xano (and all dependence)
export type PointIdentityType = {
  id: number;
  idPoint: number;
  nature: NatureEnum;
};

//TODO to  delete cause of Xano (and all dependence)
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

export function isLeafletStopType(pt: PointType) {
  return pt.nature === NatureEnum.stop;
}

export function isLeafletSchoolType(pt: PointType) {
  return pt.nature === NatureEnum.school;
}

export type CourseUnderConstructionType = {
  nextIndex: number;
  course: CourseType;
};

export enum ModeEnum {
  read,
  addCourse,
  removeCourse,
}

export enum MessageTypeEnum {
  enterRemoveCourse,
  enterAddCourse,
  removeCourse,
  addCourse,
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
  course: CourseType | null;
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
  | "stops"
  | "voirie"
  | "schools"
  | "parametres"
  | "support";

export type MenuItemType = {
  menuItem: SelectedMenuType;
  Logo: () => JSX.Element;
  label: string;
  isDisabled: boolean;
  onClick: () => void;
};

export type StopItemType = {
  id: number;
  name: string;
  quantity: number;
  nbCourse: number;
  nbEtablissement: number;
  lon: number;
  lat: number;
  selected: boolean;
};

export type EtablissementItemType = {
  id: number;
  name: string;
  quantity: number;
  nbCourse: number;
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
