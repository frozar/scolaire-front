import { ClasseType } from "./classe.entity";
import { SchoolType } from "./school.entity";
import { StopType } from "./stop.entity";
import {
  ClassToSchoolTypeFormated,
  ClassToSchoolTypeFormatedWithUsedQuantity,
} from "./student-to-school.entity";

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

  // TODO lucas formatAssociatedPointType
  static formatAssociatedClassToSchool(
    // TODO lucas associatedPointDBType
    associatedDBPoint: ClassToSchoolTypeFormated[]
    // TODO associatedPointType (comme avant avec nature et companie)
  ): ClassToSchoolTypeFormatedWithUsedQuantity[] {
    return associatedDBPoint.map((item) => {
      return {
        ...item,
        usedQuantity: 0,
      };
    });
  }
}

export type PointType = SchoolType | StopType;

export type AssociatedPointType = {
  studentSchoolId: number;
  id: number;
  name: string;
  quantity: number;
  usedQuantity: number;
  class: Omit<
    ClasseType,
    "afternoonStart" | "afternoonEnd" | "morningEnd" | "morningStart"
  >;
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
