import { createSignal, onMount } from "solid-js";
import { CalendarTable } from "../organism/CalendarTable";
import "./Calendar.css";

export type MonthType = {
  month: number;
  monthName: string;
  days: number[];
};

export const [currentMonth, setCurrentMonth] = createSignal<Date>(new Date());

export default function () {
  onMount(() => {
    const today = new Date();

    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
  });

  return (
    <section class="page-layout">
      <p class="page-title">Gestion des calendriers</p>

      <CalendarTable currentMonth={currentMonth()} />
    </section>
  );
}
