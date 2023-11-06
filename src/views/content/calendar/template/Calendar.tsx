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
