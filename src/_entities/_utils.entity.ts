import {
  getSchoolWhereClassId,
  getSchools,
} from "../views/content/map/component/organism/SchoolPoints";
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

  static formatColorForDB(color: string) {
    if (color.startsWith("#")) {
      return color.replace("#", "");
    }
    return color;
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

  static formatAssociatedClassToSchool(
    associatedDBPoint: AssociatedDBPointType[],
    school?: { id: number; name: string }
    // TODO associatedPointType (comme avant avec nature et companie)
  ): AssociatedPointType[] {
    return associatedDBPoint.map((item) => {
      if (getSchools().length != 0) {
        const bufferSchool = getSchoolWhereClassId(item.class_id);
        school = {
          id: bufferSchool?.id as number,
          name: bufferSchool?.name as string,
        };
      }

      return {
        schoolName: school?.name as string,
        schoolId: school?.id as number,
        id: item.id,
        classId: item.class_id,
        quantity: item.quantity,
        usedQuantity: 0,
        stopId: item.stop_id,
      };
    });
  }
}

export type PointType = SchoolType | StopType;

export type AssociatedPointType = {
  id: number;
  schoolId: number;
  schoolName: string;
  quantity: number;
  usedQuantity: number;
  classId: number;
  stopId?: number;
};

export type AssociatedDBPointType = {
  id: number;
  quantity: number;
  class_id: number;
  stop_id?: number;
};

export enum LocationDBTypeEnum {
  point = "point",
  path = "path",
}

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
