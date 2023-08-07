import { NatureEnum } from "../type";
import {
  AssociatedDBPointType,
  AssociatedPointType,
  EntityUtils,
  LocationDBType,
} from "./_utils.entity";

export class StopEntity {
  static build(dbStop: StopDBType): StopType {
    return {
      id: dbStop.id,
      lon: dbStop.location.data.lng,
      lat: dbStop.location.data.lat,
      name: dbStop.name,
      nature: NatureEnum.stop,
      associated: EntityUtils.formatAssociatedPoints(dbStop.associated),
    };
  }

  static dbFormat(
    stop: Omit<StopType, "id" | "selected" | "associated">
  ): Omit<StopDBType, "id" | "associated"> {
    return {
      name: stop.name,
      location: EntityUtils.builLocationPoint(stop.lon, stop.lat),
    };
  }
}

export type StopType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  associated: AssociatedPointType[];
  nature: NatureEnum;
};

export type StopDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: AssociatedDBPointType[];
};
