import { getSchoolWhereClassId } from "../views/content/map/component/organism/SchoolPoints";
import { SchoolType } from "./school.entity";
import { DBAssociatedStop, StopType } from "./stop.entity";

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

  static formatAssociatedGradeToSchoolForStop(
    associatedDBPoint: DBAssociatedStop[]
    // associatedDBPoint: AssociatedDBPointType[],
    // TODO associatedPointType (comme avant avec nature et companie)
  ): AssociatedSchoolType[] {
    return associatedDBPoint.map((item) => {
      console.log("item => ", item);
      const school = getSchoolWhereClassId(item.grade_id);

      return {
        schoolName: school?.name as string,
        schoolId: school?.id as number,
        idClassToSchool: item.id,
        gradeId: item.grade_id,
        quantity: item.quantity,
        usedQuantity: 0,
      };
    });
  }

  static formatAssociatedClassToSchoolForSchool(
    associatedDBPoint: DBAssociatedStop[],
    gradeId: number
  ): AssociatedStopType[] {
    return associatedDBPoint.map((item) => {
      return {
        idClassToSchool: item.id,
        gradeId,
        quantity: item.quantity,
        stopId: item.stop_id as number,
      };
    });
  }
}

export type PointType = SchoolType | StopType;

export type AssociatedSchoolType = {
  idClassToSchool: number;
  schoolId: number;
  schoolName: string;
  quantity: number;
  usedQuantity: number;
  gradeId: number;
};

export type AssociatedStopType = {
  idClassToSchool: number;
  stopId: number;
  quantity: number;
  gradeId: number;
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
