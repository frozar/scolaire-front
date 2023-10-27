import { createSignal, onMount } from "solid-js";
import { CalendarTable } from "../organism/CalendarTable";
import "./Calendar.css";

export type MonthType = {
  month: number;
  monthName: string;
  days: number[];
};

export type CalendarType = {
  calendarName: string;
  rules: string[];
  date_added: string[];
  date_deleted: string[];
};

export const [currentMonth, setCurrentMonth] = createSignal<Date>(new Date());

export default function () {
  onMount(() => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
  });

  const calendarsJson: CalendarType[] = [
    {
      calendarName: "Calendrier Maternel",
      rules: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      date_added: ["04-10-2023"],
      date_deleted: ["05-10-2023"],
    },
    {
      calendarName: "Calendrier Internat Lundi",
      rules: ["monday", "tuesday", "thursday", "friday"],
      date_added: ["04-10-2023"],
      date_deleted: ["02-01-2023"],
    },
    {
      calendarName: "Calendrier Collège",
      rules: ["monday", "tuesday", "thursday", "friday"],
      date_added: ["04-10-2023"],
      date_deleted: ["02-01-2023"],
    },
    {
      calendarName: "Calendrier Collège Mercredi",
      rules: ["monday", "tuesday", "thursday", "friday"],
      date_added: ["04-10-2023"],
      date_deleted: ["02-01-2023"],
    },
  ];

  return (
    <section class="page-layout">
      <p class="page-title">Gestion des calendriers</p>

      <CalendarTable currentMonth={currentMonth()} calendars={calendarsJson} />
    </section>
  );
}
