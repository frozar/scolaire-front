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
};

export type PointEtablissementType = PointRamassageType;

export function isPointRamassage(pt: { nature: NatureEnum }) {
  return pt.nature === NatureEnum.ramassage;
}

export function isPointEtablissement(pt: { nature: NatureEnum }) {
  return pt.nature === NatureEnum.etablissement;
}

export type PointIdentity = {
  id: number;
  id_point: number;
  nature: NatureEnum;
};

export type Line = { id_bus_line: number|null; stops: PointIdentity[] };

export enum ModeEnum {
  read,
  addLine,
  removeLine,
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
  content: string | JSX.Element;
};

export type removeConfirmationType = {
  displayed: boolean;
  id_bus_line: number | null;
};
