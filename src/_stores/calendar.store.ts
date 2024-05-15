import { createSignal } from "solid-js";
import { CalendarType } from "../_entities/calendar.entity";
import { CalendarService } from "../_services/calendar.service";
import { setCurrentCalendar } from "../views/content/calendar/template/Calendar";

export const [calendars, setCalendars] = createSignal<CalendarType[]>([]);

export namespace CalendarStore {
  export function set(
    _calendars: CalendarType[] | ((calendars: CalendarType[]) => CalendarType[])
  ) {
    setCalendars(_calendars);
    calendars().sort((a, b) => a.name.localeCompare(b.name));
  }

  export async function create(calendar: CalendarType) {
    const newCalendar = await CalendarService.createCalendar(calendar);
    setCalendars((prev) => {
      if (prev == undefined) return prev;
      prev = [...prev, newCalendar];
      return prev;
    });
    setCurrentCalendar(newCalendar);
  }

  export async function remove(id: number) {
    const response = await CalendarService.deleteCalendar(id);
    if (response) {
      set((prev) => {
        return [...prev.filter((item) => item.id != id)];
      });
    }
    return response;
  }
}
