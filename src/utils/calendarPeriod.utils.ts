import { CalendarPeriodType } from "../_entities/calendar.entity";
import { calendarsPeriod } from "../views/content/calendar/template/Calendar";

export namespace CalendarPeriodUtils {
  export function getById(periodId: number): CalendarPeriodType {
    return calendarsPeriod().filter(
      (calendarPeriod) => calendarPeriod.id == periodId
    )[0];
  }
}
