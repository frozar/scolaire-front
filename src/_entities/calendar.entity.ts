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

  export function buildCalendarPeriod(
    dbCalendarPeriod: CalendarPeriodDBType
  ): CalendarPeriodType {
    return {
      id: dbCalendarPeriod.id,
      name: dbCalendarPeriod.name,
      endDate: dbCalendarPeriod.end_date,
      startDate: dbCalendarPeriod.start_date,
      publicHolidays: dbCalendarPeriod.public_holidays,
      vacationsPeriod: dbCalendarPeriod.vacations_period,
    };
  }

  export function format(
    calendar: Omit<CalendarType, "id">
  ): Omit<CalendarDBType, "id"> {
    return {
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
  wednesday = "wednesday",
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

// ! --------------------- PERIOD CALENDAR ---------------------

export type PublicHolidayType = {
  name: string;
  date: Date;
};

export type VacationPeriodType = {
  name: string;
  start: Date;
  end: Date;
};

export type CalendarPeriodType = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  vacationsPeriod: VacationPeriodType[];
  publicHolidays: PublicHolidayType[];
};

export type CalendarPeriodDBType = {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  vacations_period: VacationPeriodType[];
  public_holidays: PublicHolidayType[];
};
