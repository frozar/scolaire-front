import { createSignal } from "solid-js";
import { CalendarPeriodType } from "../_entities/calendar.entity";
import { CalendarService } from "../_services/calendar.service";
import { setOnCalendarsPeriod } from "../views/content/calendar/template/Calendar";

export const [calendarsPeriod, setCalendarsPeriod] = createSignal<
  CalendarPeriodType[]
>([]);

export namespace CalendarPeriodStore {
  export function set(
    calendars:
      | CalendarPeriodType[]
      | ((calendars: CalendarPeriodType[]) => CalendarPeriodType[])
  ) {
    setCalendarsPeriod(calendars);
    calendarsPeriod().sort((a, b) => a.name.localeCompare(b.name));
  }

  export async function create(calendarPeriod: Omit<CalendarPeriodType, "id">) {
    const _calendarPeriod = await CalendarService.createCalendarPeriod(
      calendarPeriod
    );
    setCalendarsPeriod((prev) => {
      if (prev == undefined) return prev;
      prev = [...prev, _calendarPeriod];
      return prev;
    });
    setOnCalendarsPeriod(_calendarPeriod);
  }
}
