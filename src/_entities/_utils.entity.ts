import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";

export class EntityUtils {
  static builLocationPoint(lng: number, lat: number): LocationDBType {
    return {
      type: LocationDBTypeEnum.point,
      data: {
        lng: lng,
        lat: lat,
      },
    };
  }

  static formatAssociatedPoints(
    associatedDBPoint: AssociatedDBPointType[]
  ): AssociatedPointType[] {
    return associatedDBPoint.map((item) => {
      return {
        id: item.entity.id,
        name: item.entity.name,
        quantity: item.quantity,
      };
    });
  }
}

export type PointType = SchoolType | StopType;

export type AssociatedPointType = {
  id: number;
  name: string;
  quantity: number;
};

export type AssociatedDBPointType = {
  entity: {
    id: number;
    name: string;
  };
  quantity: number;
};

enum LocationDBTypeEnum {
  point = "point",
}

export type LocationDBType = {
  type: LocationDBTypeEnum;
  data: {
    lng: number;
    lat: number;
  };
};
