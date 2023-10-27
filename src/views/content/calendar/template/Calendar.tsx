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
      rules: ["monday", "tuesday", "thursday", "friday"],
      date_added: [
        "2023-10-01",
        "2023-10-02",
        "2023-10-03",
        "2023-10-04",
        "2023-10-05",
        "2023-10-06",
        "2023-10-07",
        "2023-10-08",
        "2023-10-09",
        "2023-10-10",
        "2023-10-11",
        "2023-10-12",
        "2023-10-13",
        "2023-10-14",
        "2023-10-15",
        "2023-10-16",
        "2023-10-17",
        "2023-10-18",
        "2023-10-19",
        "2023-10-20",
        "2023-10-21",
        "2023-10-22",
        "2023-10-23",
        "2023-10-24",
        "2023-10-25",
        "2023-10-26",
        "2023-10-27",
        "2023-10-28",
        "2023-10-29",
        "2023-10-30",
        "2023-10-31",
      ],
      date_deleted: [
        "2023-10-16",
        "2023-10-17",
        "2023-10-18",
        "2023-10-19",
        "2023-10-20",
      ],
    },
    // {
    //   calendarName: "Calendrier Internat Lundi",
    //   rules: ["monday", "tuesday", "thursday", "friday"],
    //   date_added: ["05-10-2023"],
    //   date_deleted: ["02-01-2023"],
    // },
    // {
    //   calendarName: "Calendrier Collège",
    //   rules: ["monday", "tuesday", "thursday", "friday"],
    //   date_added: ["04-10-2023"],
    //   date_deleted: ["02-01-2023"],
    // },
    // {
    //   calendarName: "Calendrier Collège Mercredi",
    //   rules: ["monday", "tuesday", "thursday", "friday"],
    //   date_added: ["04-10-2023"],
    //   date_deleted: ["02-01-2023"],
    // },
  ];

  return (
    <section class="page-layout">
      <p class="page-title">Gestion des calendriers</p>

      <CalendarTable currentMonth={currentMonth()} calendars={calendarsJson} />
    </section>
  );
}
