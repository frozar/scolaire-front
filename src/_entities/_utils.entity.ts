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

  static buildLocationPath(latLngs: L.LatLng[]): LocationPathDBType {
    return {
      type: LocationDBTypeEnum.path,
      data: latLngs.map((latLng) => {
        return {
          lng: latLng.lng,
          lat: latLng.lat,
        };
      }),
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
        usedQuantity: 0,
      };
    });
  }
}

export type PointType = SchoolType | StopType;

export type AssociatedPointType = {
  id: number;
  name: string;
  quantity: number;
  usedQuantity: number;
};

export type AssociatedDBPointType = {
  entity: {
    id: number;
    name: string;
  };
  quantity: number;
};

export enum LocationDBTypeEnum {
  point = "point",
  path = "path",
}

export type DBPointType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: AssociatedDBPointType[];
};

export type LocationDBType = {
  type: LocationDBTypeEnum;
  data: {
    lng: number;
    lat: number;
  };
};

export type LocationPathDBType = {
  type: LocationDBTypeEnum;
  data: {
    lng: number;
    lat: number;
  }[];
};
