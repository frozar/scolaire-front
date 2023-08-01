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
      selected: false,
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
  //TODO utility of this prop ?
  selected: boolean;
  associated: AssociatedPointType[];
};

export type StopDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: AssociatedDBPointType[];
};
