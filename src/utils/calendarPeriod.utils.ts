import { CalendarPeriodType } from "../_entities/calendar.entity";
import { calendarsPeriod } from "../_stores/calendar-period.store";

export namespace CalendarPeriodUtils {
  export function getById(periodId: number): CalendarPeriodType {
    return calendarsPeriod().filter(
      (calendarPeriod) => calendarPeriod.id == periodId
    )[0];
  }
}
