import { createSignal, onMount } from "solid-js";
import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import { CalendarTable } from "../organism/CalendarTable";
import "./Calendar.css";

export type MonthType = {
  month: number;
  monthName: string;
  days: number[];
};

export const [currentMonth, setCurrentMonth] = createSignal<Date>(new Date());

export const [calendars, setCalendars] = createSignal<CalendarType[]>([]);

export default function () {
  onMount(async () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));

    const calendars = await CalendarService.getAll();
    setCalendars(calendars);
  });

  return (
    <section class="page-layout">
      <p class="page-title">Gestion des calendriers</p>
      <CalendarTable currentMonth={currentMonth()} calendars={calendars()} />
    </section>
  );
}
