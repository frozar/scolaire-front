import { CalendarUtils } from "../views/content/calendar/calendar.utils";

export namespace CalendarEntity {
  export function build(dbCalendar: CalendarDBType): CalendarType {
    return {
      id: dbCalendar.id,
      name: dbCalendar.name,
      rules: dbCalendar.rules,
      added: CalendarUtils.stringListToDateTimeList(dbCalendar.date_added),
      deleted: CalendarUtils.stringListToDateTimeList(dbCalendar.date_deleted),
    };
  }

  export function format(calendar: CalendarType): CalendarDBType {
    return {
      id: calendar.id,
      name: calendar.name,
      rules: calendar.rules,
      date_added: CalendarUtils.dateTimeListToStringList(calendar.added),
      date_deleted: CalendarUtils.dateTimeListToStringList(calendar.deleted),
    };
  }
}

export enum CalendarDayEnum {
  monday = "monday",
  tuesday = "tuesday",
  wednersday = "wednersday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export type CalendarType = {
  id: number;
  name: string;
  rules: CalendarDayEnum[];
  added: number[];
  deleted: number[];
};

export type CalendarDBType = {
  id: number;
  name: string;
  rules: CalendarDayEnum[];
  date_added: string[];
  date_deleted: string[];
};
