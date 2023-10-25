import { AssociatedSchoolType } from "./_utils.entity";
import { DBAssociatedStop } from "./stop.entity";

export namespace GradeEntity {
  export function build(dbData: GradeDBType): GradeType {
    return {
      id: dbData.id,
      name: dbData.name,
      morningStart: getHourFormatFromString(dbData.morning_start),
      morningEnd: getHourFormatFromString(dbData.morning_end),
      afternoonStart: getHourFormatFromString(dbData.afternoon_start),
      afternoonEnd: getHourFormatFromString(dbData.afternoon_end),
    };
  }
  export function dbFormat(grade: GradeType): Omit<GradeDBType, "id"> {
    return {
      school_id: grade.schoolId as number,
      name: grade.name,
      morning_start: getStringFromHeureFormat(grade.morningStart),
      morning_end: getStringFromHeureFormat(grade.morningEnd),
      afternoon_start: getStringFromHeureFormat(grade.afternoonStart),
      afternoon_end: getStringFromHeureFormat(grade.afternoonEnd),
    };
  }
  function getStringFromHeureFormat(time: HeureFormat) {
    return String(time.hour) + ":" + String(time.minutes);
  }

  function getHourFormatFromString(time: string) {
    return {
      hour: Number(time.split(":")[0]),
      minutes: Number(time.split(":")[1]),
    };
  }
}

export type HeureFormat = {
  hour: number;
  minutes: number;
};

export type GradeDBType = {
  id: number;
  school_id: number;
  name: string;
  morning_start: string;
  morning_end: string;
  afternoon_start: string;
  afternoon_end: string;
  associated?: DBAssociatedStop[];
};

export type GradeType = {
  id?: number;
  schoolId?: number;
  name: string;
  morningStart: HeureFormat;
  morningEnd: HeureFormat;
  afternoonStart: HeureFormat;
  afternoonEnd: HeureFormat;
  associated?: AssociatedSchoolType[];
};

export type GradeTripType = {
  gradeId: number;
  quantity: number;
};

export type GradeTripDBType = {
  grade_id: number;
  quantity: number;
};
