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
        "02-10-2023",
        "03-10-2023",
        "04-10-2023",
        "05-10-2023",
        "06-10-2023",
        "09-10-2023",
        "10-10-2023",
        "11-10-2023",
        "12-10-2023",
        "13-10-2023",
        "16-10-2023",
        "17-10-2023",
        "18-10-2023",
        "19-10-2023",
        "20-10-2023",
        "23-10-2023",
        "24-10-2023",
        "25-10-2023",
        "26-10-2023",
        "27-10-2023",
        "30-10-2023",
        "31-10-2023",

        "01-11-2023",
        "02-11-2023",
        "03-11-2023",
        "04-11-2023",
        "06-11-2023",
        "07-11-2023",
        "08-11-2023",
        "09-11-2023",
        "10-11-2023",
        "13-11-2023",
        "14-11-2023",
        "15-11-2023",
        "16-11-2023",
        "17-11-2023",
        "20-11-2023",
        "21-11-2023",
        "22-11-2023",
        "23-11-2023",
        "24-11-2023",
        "27-11-2023",
        "28-11-2023",
        "29-11-2023",
        "30-11-2023",
      ],
      date_deleted: ["01-10-2023"],
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
