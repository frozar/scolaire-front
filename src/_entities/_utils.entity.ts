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
}

export type PointType = {
  id: number;
  name: string;
  lon: number;
  lat: number;
  //TODO utility of this prop ?
  selected: boolean;
  associated: AssociatedPointType[];
};

export type AssociatedPointType = {
  id: number;
  name: string;
  quantity: number;
};

export type DBPointType = {
  id: number;
  name: string;
  location: LocationDBType;
  associated: AssociatedDBPointType[];
};

export type AssociatedDBPointType = {
  entity: {
    id: number;
    name: string;
  };
  quantity: number;
};

export type LocationDBType = {
  type: LocationDBTypeEnum;
  data: {
    lng: number;
    lat: number;
  };
};

enum LocationDBTypeEnum {
  point = "point",
}
