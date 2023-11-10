import {
  CalendarDayEnum,
  CalendarPeriodType,
  CalendarType,
} from "../../../_entities/calendar.entity";

export namespace CalendarUtils {
  export function getMonthName(date: Date): string {
    return date.toLocaleString("default", {
      month: "long",
    });
  }

  export function dayIsInPeriod(day: Date, calendarPeriod: CalendarPeriodType) {
    return day > calendarPeriod.startDate && day < calendarPeriod.endDate;
  }

  export function dayToFrench(day: CalendarDayEnum): string {
    switch (day) {
      case CalendarDayEnum.monday:
        return "Lundi";
      case CalendarDayEnum.tuesday:
        return "Mardi";
      case CalendarDayEnum.wednesday:
        return "Mercredi";
      case CalendarDayEnum.thursday:
        return "Jeudi";
      case CalendarDayEnum.friday:
        return "Vendredi";
      case CalendarDayEnum.saturday:
        return "Samedi";
      case CalendarDayEnum.sunday:
        return "Dimanche";
      default:
        return "";
    }
  }

  export function getDaysOfMonth(date: Date): Date[] {
    const days = [];
    const numberOfDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= numberOfDay; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  }

  export function getDayName(date: Date, toLower = false): string {
    const name = date.toLocaleString("en-EN", {
      weekday: "long",
    });
    return toLower ? name.toLowerCase() : name;
  }

  export function stringListToDateTimeList(dates: string[]): number[] {
    const output: number[] = [];
    dates.forEach((date) => {
      output.push(stringToDate(date).getTime());
    });
    return output;
  }

  export function dateTimeListToStringList(dates: number[]): string[] {
    const output: string[] = [];
    dates.forEach((date) => {
      const bufferDate = new Date(date);
      output.push(
        `${bufferDate.getFullYear()}-${
          bufferDate.getMonth() + 1
        }-${bufferDate.getDate()}`
      );
    });
    return output;
  }

  export function stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  export function isActiveDay(date: Date, calendar: CalendarType): boolean {
    const isDateInRule = calendar.rules.includes(
      CalendarUtils.getDayName(date, true) as CalendarDayEnum
    );

    if (calendar.added.includes(date.getTime())) return true;
    if (!isDateInRule) return false;
    if (calendar.deleted.includes(date.getTime())) return false;

    return true;
  }

  export function isWeekend(date: Date): boolean {
    const dayName = CalendarUtils.getDayName(date).toLowerCase();
    return dayName == "saturday" || dayName == "sunday";
  }

  export function compareDate(date: Date, toCompare: Date): boolean {
    if (
      date.getFullYear() == toCompare.getFullYear() &&
      date.getMonth() == toCompare.getMonth() &&
      CalendarUtils.getDayName(date) == CalendarUtils.getDayName(toCompare)
    )
      return true;
    else return false;
  }

  export function isAnAddedDate(date: Date, calendar: CalendarType): boolean {
    if (calendar.added.includes(date.getTime())) return true;
    return false;
  }

  export function isADeletedDate(date: Date, calendar: CalendarType): boolean {
    if (calendar.deleted.includes(date.getTime())) return true;
    return false;
  }

  export function isARulesDate(date: Date, calendar: CalendarType): boolean {
    const dayName = CalendarUtils.getDayName(date, true);
    if (calendar.rules.includes(dayName as CalendarDayEnum)) return true;
    return false;
  }

  export function isDayInRules(day: CalendarDayEnum, calendar: CalendarType) {
    return calendar.rules.includes(day);
  }
}
