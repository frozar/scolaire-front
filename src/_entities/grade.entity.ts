import { AssociatedSchoolType, HoursDBType, HoursType } from "./_utils.entity";
import { DBAssociatedStop } from "./stop.entity";
import { TimeUtils } from "./time.utils";

export namespace GradeEntity {
  export function build(dbData: GradeDBType): GradeType {
    return {
      id: dbData.id,
      name: dbData.name,
      hours: TimeUtils.buildHours(dbData.hours),
    };
  }

  export function dbFormat(grade: GradeType): Omit<GradeDBType, "id"> {
    return {
      school_id: grade.schoolId as number,
      name: grade.name,
      hours: TimeUtils.formatHours(grade.hours),
    };
  }

  // TODO Maybe replace these functions into another file ? time.utils.ts
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
  hours?: HoursDBType;
  associated?: DBAssociatedStop[];
};

export type GradeType = {
  id?: number;
  schoolId?: number;
  name: string;
  hours: HoursType;
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
