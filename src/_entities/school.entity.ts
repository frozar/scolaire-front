import {
  AssociatedDBPointType,
  AssociatedPointType,
  EntityUtils,
  LocationDBType,
} from "./_utils.entity";

export class SchoolEntity {
  static build(dbSchool: SchoolDBType): SchoolType {
    return {
      id: dbSchool.id,
      lon: dbSchool.location.data.lng,
      lat: dbSchool.location.data.lat,
      name: dbSchool.name,
      selected: false,
      associated: EntityUtils.formatAssociatedPoints(dbSchool.associated),
    };
  }

  static dbFormat(
    school: Omit<SchoolType, "id" | "selected" | "associated">
  ): Omit<SchoolDBType, "id" | "associated"> {
    return {
      name: school.name,
      location: EntityUtils.builLocationPoint(school.lon, school.lat),
    };
  }
}

export type SchoolType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  //TODO utility of this prop ?
  selected: boolean;
  associated: AssociatedPointType[];
};

export type SchoolDBType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: AssociatedDBPointType[];
};

export type LeafletShoolType = SchoolType & {
  idPoint: number;
};
