import { HourRuleType, HoursDBType, HoursType } from "./_utils.entity";
import { CalendarDayEnum, CalendarType } from "./calendar.entity";
import { GradeEntity, GradeType, HourFormat } from "./grade.entity";
import { SchoolType } from "./school.entity";

export namespace TimeUtils {
  export function defaultHours(): HoursType {
    return {
      id: 0,
      startHourGoing: null,
      startHourComing: null,
      endHourComing: null,
      endHourGoing: null,
      rules: [],
    };
  }

  export function getRemainingRuleDays(
    rules: HourRuleType[],
    calendar: CalendarType
  ): CalendarDayEnum[] {
    const calendarDays = calendar.rules.map((rule) => rule.day);
    const alreadyUsedDays = rules.map((rule) => rule.day);
    return calendarDays.filter((day) => !alreadyUsedDays.includes(day));
  }

  // TODO to replace by getRemainingRuleDays
  export function getRemainingDays(
    item: SchoolType | GradeType | undefined
  ): CalendarDayEnum[] {
    if (!item) return [];

    const calendarDays = (item.calendar as CalendarType).rules.map(
      (rule) => rule.day
    );

    const alreadyUsedDays = item.hours.rules.map((rule) => rule.day);
    return calendarDays.filter((day) => !alreadyUsedDays.includes(day));
  }

  export function defaultRule(day: CalendarDayEnum): HourRuleType {
    const defaultHourFormat: HourFormat = {
      hour: 0,
      minutes: 0,
    };

    return {
      day,
      startComing: defaultHourFormat,
      endComing: defaultHourFormat,
      startGoing: defaultHourFormat,
      endGoing: defaultHourFormat,
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
      rules: hours.rules.map((item) => {
        return {
          day: item.day,
          startComing: TimeUtils.getHourFormatFromString(item.start_coming),
          endComing: TimeUtils.getHourFormatFromString(item.end_coming),
          startGoing: TimeUtils.getHourFormatFromString(item.start_going),
          endGoing: TimeUtils.getHourFormatFromString(item.end_going),
        };
      }),
    };
  }

  export function formatHours(hours: HoursType | undefined): HoursDBType {
    if (!hours) return formatHours(defaultHours());
    return {
      id: hours.id as number,
      start_hour_coming: GradeEntity.getStringFromHourFormat(
        hours.startHourComing as HourFormat
      ),
      end_hour_coming: GradeEntity.getStringFromHourFormat(
        hours.endHourComing as HourFormat
      ),
      start_hour_going: GradeEntity.getStringFromHourFormat(
        hours.startHourGoing as HourFormat
      ),
      end_hour_going: GradeEntity.getStringFromHourFormat(
        hours.endHourGoing as HourFormat
      ),
      rules: hours.rules.map((item) => {
        return {
          day: item.day,
          start_coming: TimeUtils.getStringFromHourFormat(item.startComing),
          end_coming: TimeUtils.getStringFromHourFormat(item.endComing),
          start_going: TimeUtils.getStringFromHourFormat(item.startGoing),
          end_going: TimeUtils.getStringFromHourFormat(item.endGoing),
        };
      }),
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
