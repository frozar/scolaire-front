import { CalendarDatesType } from "../_entities/gtfs.entity";

export namespace GtfsUtils {
  export function formatDate(date: Date): string {
    const day = date.getDate();
    const formatedDay =
      String(day).length == 1 ? "0" + String(day) : String(day);

    const month = date.getMonth() + 1;
    const formatedMonth =
      String(month).length == 1 ? "0" + String(month) : String(month);

    return String(date.getFullYear()) + formatedMonth + formatedDay;
  }

  export function addDays(date: Date, daysToAdd: number): string {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + daysToAdd
    );
    return formatDate(newDate);
  }

  export function isDateExceptionAlreadyAdded(
    calendarDate: CalendarDatesType,
    calendarDates: CalendarDatesType[]
  ): boolean {
    for (const exceptionDate of calendarDates) {
      if (
        exceptionDate.service_id == calendarDate.service_id &&
        exceptionDate.date == calendarDate.date
      ) {
        return true;
      }
    }
    return false;
  }
}
