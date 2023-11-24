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
      morning_start: getStringFromHourFormat(grade.morningStart),
      morning_end: getStringFromHourFormat(grade.morningEnd),
      afternoon_start: getStringFromHourFormat(grade.afternoonStart),
      afternoon_end: getStringFromHourFormat(grade.afternoonEnd),
    };
  }

  export function getStringFromHourFormat(time: HourFormat | undefined) {
    if (time == undefined) return "00:00";
    let houre = time.hour.toString();
    let minutes = time.minutes.toString();

    if (houre.length == 1) houre = "0" + houre;
    if (minutes.length == 1) minutes = "0" + minutes;
    if (Number(minutes) > 59) minutes = "59";

    return houre + ":" + minutes;
  }

  export function getHourFormatFromString(time: string): HourFormat {
    const [houre, minute] = time.split(":");
    if (isNaN(Number(houre)) || isNaN(Number(minute)))
      return {
        hour: 0,
        minutes: 0,
      };
    const roundedMinute = Math.round(Number(minute) / 5) * 5;

    return {
      hour: Number(houre),
      minutes: Number(roundedMinute),
    };
  }
}

export type HourFormat = {
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
  morningStart: HourFormat;
  morningEnd: HourFormat;
  afternoonStart: HourFormat;
  afternoonEnd: HourFormat;
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
