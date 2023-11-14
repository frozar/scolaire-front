import { CalendarUtils } from "../views/content/calendar/calendar.utils";

export namespace CalendarEntity {
  export function build(dbCalendar: CalendarDBType): CalendarType {
    return {
      id: dbCalendar.id,
      name: dbCalendar.name,
      rules: dbCalendar.rules,
      added: CalendarUtils.stringListToDateTimeList(dbCalendar.date_added),
      deleted: CalendarUtils.stringListToDateTimeList(dbCalendar.date_deleted),
      calendarPeriodId: dbCalendar.calendar_period_id,
    };
  }

  export function buildCalendarPeriod(
    dbCalendarPeriod: CalendarPeriodDBType
  ): CalendarPeriodType {
    return {
      id: dbCalendarPeriod.id,
      name: dbCalendarPeriod.name,
      endDate: new Date(dbCalendarPeriod.end_date),
      startDate: new Date(dbCalendarPeriod.start_date),
      publicHolidays: dbCalendarPeriod.public_holidays.map((item) => {
        return {
          name: item.name,
          date: new Date(item.date),
        };
      }),
      vacationsPeriod: dbCalendarPeriod.vacations_period.map((item) => {
        return {
          name: item.name,
          start: new Date(item.start),
          end: new Date(item.end),
        };
      }),
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
      calendar_period_id: calendar.calendarPeriodId,
    };
  }

  export function formatCalendarPeriod(
    calendarPeriod: CalendarPeriodType
  ): CalendarPeriodDBType {
    return {
      id: calendarPeriod.id,
      name: calendarPeriod.name,
      start_date: calendarPeriod.startDate.toISOString().substring(0, 10),
      end_date: calendarPeriod.endDate.toISOString().substring(0, 10),
      public_holidays: calendarPeriod.publicHolidays.map((item) => {
        return {
          name: item.name,
          date: item.date.toISOString().substring(0, 10),
        };
      }),
      vacations_period: calendarPeriod.vacationsPeriod.map((item) => {
        return {
          name: item.name,
          start: item.start.toISOString().substring(0, 10),
          end: item.end.toISOString().substring(0, 10),
        };
      }),
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
  calendarPeriodId?: number;
};

export type CalendarDBType = {
  id: number;
  name: string;
  rules: CalendarDayEnum[];
  date_added: string[];
  date_deleted: string[];
  calendar_period_id?: number;
};

// ! --------------------- PERIOD CALENDAR ---------------------

export type PublicHolidayType = {
  name: string;
  date: Date;
};

export type PublicHolidayDBType = {
  name: string;
  date: string;
};

export type VacationPeriodType = {
  name: string;
  start: Date;
  end: Date;
};

export type VacationPeriodDBType = {
  name: string;
  start: string;
  end: string;
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
  start_date: string;
  end_date: string;
  vacations_period: VacationPeriodDBType[];
  public_holidays: PublicHolidayDBType[];
};
