import {
  CalendarDBType,
  CalendarEntity,
  CalendarPeriodDBType,
  CalendarPeriodType,
  CalendarType,
} from "../_entities/calendar.entity";
import { ServiceUtils } from "./_utils.service";

export namespace CalendarService {
  export async function getAll(): Promise<CalendarType[]> {
    const dbCalendars: CalendarDBType[] = await ServiceUtils.get("/calendar");
    return dbCalendars
      ? dbCalendars.map((dbCalendar: CalendarDBType) => {
          return CalendarEntity.build(dbCalendar);
        })
      : [];
  }

  export async function updateCalendar(
    calendar: CalendarType
  ): Promise<CalendarType> {
    const dbCalendar: CalendarDBType = await ServiceUtils.patch(
      "/calendar/" + calendar.id,
      { calendar: CalendarEntity.format(calendar) }
    );

    return CalendarEntity.build(dbCalendar);
  }

  export async function createCalendar(
    calendar: Omit<CalendarType, "id">
  ): Promise<CalendarType> {
    const dbCalendar: CalendarDBType = await ServiceUtils.post("/calendar", {
      calendar: CalendarEntity.format(calendar),
    });

    return CalendarEntity.build(dbCalendar);
  }

  export async function getAllCalendarPeriod() {
    const dbCalendarPeriod: CalendarPeriodDBType[] = await ServiceUtils.get(
      "/calendar-periods"
    );

    return dbCalendarPeriod.map((calendar) =>
      CalendarEntity.buildCalendarPeriod(calendar)
    );
  }

  export async function updateCalendarPeriod(
    calendarPeriod: CalendarPeriodType
  ) {
    const dbCalendarPeriod: CalendarPeriodDBType = await ServiceUtils.patch(
      "/calendar-period/" + calendarPeriod.id,
      { calendar_period: CalendarEntity.formatCalendarPeriod(calendarPeriod) }
    );

    return CalendarEntity.buildCalendarPeriod(dbCalendarPeriod);
  }
}
