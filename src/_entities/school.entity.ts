import {
  AssociatedDBPointType,
  DBPointType,
  EntityUtils,
  PointType,
} from "./_utils.entity";

export class SchoolEntity {
  static build(dbSchool: SchoolDBType): SchoolType {
    return {
      id: dbSchool.id,
      lon: dbSchool.location.data.lng,
      lat: dbSchool.location.data.lat,
      name: dbSchool.name,
      selected: false,
      associated: formatAssociatedPoints(dbSchool.associated),
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

const formatAssociatedPoints = (associatedDBPoint: AssociatedDBPointType[]) => {
  return associatedDBPoint.map((item) => {
    return {
      id: item.entity.id,
      name: item.entity.name,
      quantity: item.quantity,
    };
  });
};

export type SchoolType = PointType;

export type SchoolDBType = DBPointType;
