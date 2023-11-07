import {
  CalendarDBType,
  CalendarEntity,
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
    const formatedToDBCalendar: CalendarDBType =
      CalendarEntity.format(calendar);
    const dbCalendar: CalendarDBType = await ServiceUtils.patch("/calendar", {
      calendar: formatedToDBCalendar,
    });
    return CalendarEntity.build(dbCalendar);
  }
}
