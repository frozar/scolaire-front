import _ from "lodash";
import { GradeUtils } from "../utils/grade.utils";
import { QuantityMatrixType, QuantityUtils } from "../utils/quantity.utils";
import { getSchoolWhereClassId } from "../views/content/map/component/organism/SchoolPoints";
import { CalendarDayEnum } from "./calendar.entity";
import { HourFormat } from "./grade.entity";
import { SchoolType } from "./school.entity";
import { DBAssociatedStop, StopType } from "./stop.entity";

export class EntityUtils {
  // xano only keep 12 numbers after decimal point and round strangely
  static builLocationPoint(lng: number, lat: number): LocationDBType {
    return {
      type: LocationDBTypeEnum.point,
      data: {
        lng: _.round(lng, 12),
        lat: _.round(lat, 12),
      },
    };
  }

  static defaultHours(): HoursType {
    return {
      id: null,
      startHourComing: null,
      endHourComing: null,
      startHourGoing: null,
      endHourGoing: null,
      rules: [],
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
      const school = getSchoolWhereClassId(item.grade_id);
      const grade = GradeUtils.getGrade(item.grade_id);

      let gradeRules: CalendarDayEnum[];

      if (grade.calendar)
        gradeRules = grade.calendar?.rules.map((rule) => rule.day);
      else
        gradeRules = school?.calendar
          ? school?.calendar.rules.map((rule) => rule.day)
          : [];

      return {
        schoolId: school?.id as number,
        idClassToSchool: item.id,
        gradeId: item.grade_id,
        quantity: item.quantity,
        quantityMatrix: QuantityUtils.baseQuantityMatrix(
          gradeRules,
          item.quantity
        ),
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
  idClassToSchool: number; // TODO: Rename
  schoolId: number;
  quantity: number;
  gradeId: number;
  quantityMatrix: QuantityMatrixType;
};

export type AssociatedStopType = {
  idClassToSchool: number; // TODO: Rename
  stopId: number;
  quantity: number;
  //TODO potentiellement inutile... un AssociatedStopType est forcément lié à un grade en amont
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

// TODO replace these type onto time.utils.ts
export type HoursDBType = {
  id: number;
  start_hour_coming: string;
  end_hour_coming: string;
  start_hour_going: string;
  end_hour_going: string;
  rules: HourRuleDBType[];
};

export type HoursType = {
  id: number | null;
  startHourComing: HourFormat | null;
  endHourComing: HourFormat | null;
  startHourGoing: HourFormat | null;
  endHourGoing: HourFormat | null;
  rules: HourRuleType[];
};

export type HourRuleDBType = {
  day: CalendarDayEnum;
  start_coming: string;
  end_coming: string;
  start_going: string;
  end_going: string;
};

export type HourRuleType = {
  day: CalendarDayEnum;
  startComing: HourFormat;
  endComing: HourFormat;
  startGoing: HourFormat;
  endGoing: HourFormat;
};
