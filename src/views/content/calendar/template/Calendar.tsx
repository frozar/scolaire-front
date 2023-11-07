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

export enum CalendarActionsEnum {
  add = "add",
  remove = "remove",
  rules = "rules",
}

export const [currentMonth, setCurrentMonth] = createSignal<Date>(new Date());
export const [calendars, setCalendars] = createSignal<CalendarType[]>([]);
export const [currentCalendar, setCurrentCalendar] =
  createSignal<CalendarType>();

export function toggleAddedDate(date: Date) {
  const indexof = currentCalendar()?.added.findIndex(
    (item) => item == date.getTime()
  );

  setCurrentCalendar((prev) => {
    if (prev == undefined) return prev;
    const data = { ...prev };

    if (indexof == -1) data.added.push(date.getTime());
    else data.added = data.added.filter((item) => item != date.getTime());

    return data;
  });
}

export function toggleDeletedDate(date: Date) {
  const indexof = currentCalendar()?.deleted.findIndex(
    (item) => item == date.getTime()
  );

  setCurrentCalendar((prev) => {
    if (prev == undefined) return prev;
    const data = { ...prev };

    if (indexof == -1) data.deleted.push(date.getTime());
    else data.deleted = data.deleted.filter((item) => item != date.getTime());

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
    setCalendars(await CalendarService.getAll());
    setCurrentCalendar(calendars()[0]);
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
