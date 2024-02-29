import {
  CalendarDBType,
  CalendarEntity,
  CalendarPeriodDBType,
  CalendarPeriodType,
  CalendarType,
} from "../_entities/calendar.entity";
import { ServiceUtils } from "./_utils.service";

export namespace CalendarService {
  export async function importCalendar(calendars: CalendarType[]) {
    const calendars_ = await ServiceUtils.post("/import/calendars", {
      calendars: calendars.map((calendar) => CalendarEntity.format(calendar)),
    });
    return calendars_.map((calendar: CalendarDBType) =>
      CalendarEntity.build(calendar)
    );
  }

  export async function importCalendarPeriod(
    calendarPeriod: CalendarPeriodType[]
  ) {
    const calendarsPeriods = await ServiceUtils.post(
      "/import/calendars_period",
      {
        calendars_periods: calendarPeriod.map((calendar) =>
          CalendarEntity.formatCalendarPeriod(calendar)
        ),
      }
    );
    return calendarsPeriods.map((calendar: CalendarPeriodDBType) =>
      CalendarEntity.buildCalendarPeriod(calendar)
    );
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

  export async function createCalendarPeriod(
    calendar: Omit<CalendarPeriodType, "id">
  ): Promise<CalendarPeriodType> {
    const dbCalendar: CalendarPeriodDBType = await ServiceUtils.post(
      "/calendar-period",
      {
        calendar_period: CalendarEntity.formatCalendarPeriod({
          id: 0,
          ...calendar,
        }),
      }
    );

    return CalendarEntity.buildCalendarPeriod(dbCalendar);
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

  export async function deleteCalendar(calendarId: number) {
    return await ServiceUtils.delete("/calendar/" + calendarId);
  }

  export async function deleteCalendarPerdio(calendarId: number) {
    return await ServiceUtils.delete("/calendar-period/" + calendarId);
  }
}
