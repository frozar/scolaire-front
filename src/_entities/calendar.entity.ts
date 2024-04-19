import { CalendarUtils } from "../views/content/calendar/calendar.utils";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "./trip-direction.entity";

export namespace CalendarEntity {
  export function build(dbCalendar: CalendarDBType): CalendarType {
    return {
      id: dbCalendar.id,
      name: dbCalendar.name,
      rules: buildRules(dbCalendar.rules),
      added: buildAddedDate(dbCalendar.date_added),
      calendarPeriodId: dbCalendar.calendar_period_id,
    };
  }

  export function format(
    calendar: Omit<CalendarType, "id">
  ): Omit<CalendarDBType, "id"> {
    return {
      name: calendar.name,
      rules: calendar.rules.map((item) => {
        return {
          day: item.day,
          trip_type_id:
            item.tripTypeId ??
            TripDirectionEntity.findDirectionByDirectionName(
              TripDirectionEnum.roundTrip
            ).id,
        };
      }),
      date_added: calendar.added.map((item) => {
        const bufferDate = new Date(item.date);
        return {
          date: `${bufferDate.getFullYear()}-${
            bufferDate.getMonth() + 1
          }-${bufferDate.getDate()}`,
          reference: item.reference,
        };
      }),

      calendar_period_id: calendar.calendarPeriodId,
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
      publicHolidays: buildPublicHolidays(dbCalendarPeriod.public_holidays),
      vacationsPeriod: buildVacationsPeriod(dbCalendarPeriod.vacations_period),
    };
  }

  export function formatCalendarPeriod(
    calendarPeriod: CalendarPeriodType
  ): CalendarPeriodDBType {
    return {
      id: calendarPeriod.id,
      name: calendarPeriod.name,
      start_date: CalendarUtils.dateToString(calendarPeriod.startDate),
      end_date: CalendarUtils.dateToString(calendarPeriod.endDate),
      public_holidays: calendarPeriod.publicHolidays.map((item) => {
        return {
          name: item.name,
          date: CalendarUtils.dateToString(item.date),
        };
      }),
      vacations_period: calendarPeriod.vacationsPeriod.map((item) => {
        return {
          name: item.name,
          start: CalendarUtils.dateToString(item.start),
          end: CalendarUtils.dateToString(item.end),
        };
      }),
    };
  }

  function buildAddedDate(addedDates: DateAddedDBType[]): DateAddedType[] {
    return addedDates.map((item) => {
      return {
        date: CalendarUtils.stringToDate(item.date).getTime(),
        reference: item.reference,
      };
    });
  }

  function buildRules(rules: RulesDBType[]): RulesType[] {
    return rules.map((item) => {
      return {
        day: item.day,
        tripTypeId: item.trip_type_id,
        tripDirection: item.trip_direction as TripDirectionType,
      };
    });
  }

  function buildPublicHolidays(
    publicHolidays: PublicHolidayDBType[]
  ): PublicHolidayType[] {
    return publicHolidays.map((item) => {
      return {
        name: item.name,
        date: new Date(item.date),
      };
    });
  }

  function buildVacationsPeriod(
    vacationsPeriod: VacationPeriodDBType[]
  ): VacationPeriodType[] {
    return vacationsPeriod.map((item) => {
      return {
        name: item.name,
        start: new Date(item.start),
        end: new Date(item.end),
      };
    });
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

export const OrderedDaysList = [
  CalendarDayEnum.monday,
  CalendarDayEnum.tuesday,
  CalendarDayEnum.wednesday,
  CalendarDayEnum.thursday,
  CalendarDayEnum.friday,
  CalendarDayEnum.saturday,
  CalendarDayEnum.sunday,
];

export type TripDirectionType = {
  id: number;
  type: TripDirectionEnum;
};

// TODO remove tripTypeId repercussion on calendar page select a calendar to edit in the rule section need it.
export type RulesType = {
  tripTypeId?: number;
  tripDirection: TripDirectionType;
  day: CalendarDayEnum;
};

export type RulesDBType = {
  trip_type_id: number;
  trip_direction?: TripDirectionType;
  day: CalendarDayEnum;
};

export type DateAddedType = {
  date: number;
  reference: CalendarDayEnum;
};

export type CalendarType = {
  id: number;
  name: string;
  rules: RulesType[];
  added: DateAddedType[];
  calendarPeriodId?: number;
};

export type DateAddedDBType = {
  date: string;
  reference: CalendarDayEnum;
};

export type CalendarDBType = {
  id: number;
  name: string;
  rules: RulesDBType[];
  date_added: DateAddedDBType[];
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
