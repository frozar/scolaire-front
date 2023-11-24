import { HoursDBType, HoursType } from "./_utils.entity";
import { GradeEntity, HourFormat } from "./grade.entity";

export namespace TimeUtils {
  function defaultHours(): HoursType {
    return {
      id: 0,
      startHourGoing: {
        hour: 7,
        minutes: 0,
      },
      startHourComing: {
        hour: 7,
        minutes: 30,
      },
      endHourComing: {
        hour: 7,
        minutes: 0,
      },
      endHourGoing: {
        hour: 7,
        minutes: 30,
      },
    };
  }
  export function buildHours(hours: HoursDBType | undefined): HoursType {
    if (!hours) return defaultHours();
    return {
      id: hours.id,
      startHourComing: GradeEntity.getHourFormatFromString(
        hours.start_hour_coming
      ),
      startHourGoing: GradeEntity.getHourFormatFromString(
        hours.start_hour_going
      ),
      endHourComing: GradeEntity.getHourFormatFromString(hours.end_hour_coming),
      endHourGoing: GradeEntity.getHourFormatFromString(hours.end_hour_going),
    };
  }

  export function formatHours(hours: HoursType | undefined): HoursDBType {
    if (!hours) return formatHours(defaultHours());
    return {
      id: hours.id,
      start_hour_coming: GradeEntity.getStringFromHourFormat(
        hours.startHourComing
      ),
      end_hour_coming: GradeEntity.getStringFromHourFormat(hours.endHourComing),
      start_hour_going: GradeEntity.getStringFromHourFormat(
        hours.startHourGoing
      ),
      end_hour_going: GradeEntity.getStringFromHourFormat(hours.endHourGoing),
    };
  }

  // TODO same function into GradeEntity, delete from they and use from here
  export function getStringFromHourFormat(time: HourFormat | undefined) {
    if (time == undefined) return "00:00";
    let houre = time.hour.toString();
    let minutes = time.minutes.toString();

    if (houre.length == 1) houre = "0" + houre;
    if (minutes.length == 1) minutes = "0" + minutes;
    if (Number(minutes) > 59) minutes = "59";

    return houre + ":" + minutes;
  }

  export function GradeEntitygetHourFormatFromString(time: string): HourFormat {
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
