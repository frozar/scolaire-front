import { Show, createSignal, onMount } from "solid-js";
import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import { CalendarEdition } from "../organism/CalendarEdtion";
import { CalendarTable } from "../organism/CalendarTable";
import "./Calendar.css";

export type MonthType = {
  month: number;
  monthName: string;
  days: number[];
};

export const [currentMonth, setCurrentMonth] = createSignal<Date>(new Date());
export const [calendars, setCalendars] = createSignal<CalendarType[]>([]);
export const [currentCalendar, setCurrentCalendar] =
  createSignal<CalendarType>();

export function appendAddedDateToCurrentCalendar(date: Date) {
  setCurrentCalendar((prev) => {
    if (prev == undefined) return prev;
    const data = { ...prev };
    data.added.push(date.getTime());
    return data;
  });
}

export function updateCalendars(calendar: CalendarType) {
  setCalendars((prev) => {
    if (prev == undefined) return prev;
    const calendars = [...prev];
    const indexOfCalendar = calendars.findIndex(
      (item) => item.id == calendar.id
    );
    calendars[indexOfCalendar] = calendar;
    return calendars;
  });
}

export default function () {
  onMount(async () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));

    const calendars = await CalendarService.getAll();
    setCalendars(calendars);
    setCurrentCalendar(calendars[0]);
  });

  return (
    <section class="page-layout">
      <p class="page-title">Gestion des calendriers</p>
      <CalendarTable currentMonth={currentMonth()} calendars={calendars()} />

      <Show when={currentCalendar() != undefined}>
        <CalendarEdition
          calendar={currentCalendar() as CalendarType}
          currentMonth={currentMonth()}
        />
      </Show>
    </section>
  );
}
