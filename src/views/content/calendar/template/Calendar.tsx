import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import {
  disableSpinningWheel,
  displayedSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { CalendarEdition } from "../organism/CalendarEdtion";
import { CalendarTable } from "../organism/CalendarTable";
import { SchoolCalendar } from "../organism/SchoolCalendar";
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

export function pushCalendar(calendar: CalendarType) {
  setCalendars((prev) => {
    if (prev == undefined) return prev;
    prev = [...prev, calendar];
    return prev;
  });
}
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

export function updateCalendarRules(day: CalendarDayEnum) {
  const indexof = currentCalendar()?.rules.findIndex((item) => item == day);

  setCurrentCalendar((prev) => {
    if (prev == undefined) return prev;
    const data = { ...prev };

    if (indexof == -1) data.rules.push(day);
    else data.rules = data.rules.filter((item) => item != day);
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

enum CalendarPanelEnum {
  calendarManager,
  schoolCalendar,
}

export const [onCalendarPanel, setOnCalendarPanel] =
  createSignal<CalendarPanelEnum>(CalendarPanelEnum.calendarManager);

export default function () {
  enableSpinningWheel();

  onMount(async () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
    setCalendars(await CalendarService.getAll());
    disableSpinningWheel();
  });

  function switchCalendarPanel() {
    const nextCalendarPanel =
      onCalendarPanel() == CalendarPanelEnum.calendarManager
        ? CalendarPanelEnum.schoolCalendar
        : CalendarPanelEnum.calendarManager;
    setOnCalendarPanel(nextCalendarPanel);
  }

  return (
    <section class="page-layout">
      <div class="calendar-panels-action">
        <button
          onClick={switchCalendarPanel}
          class="page-title"
          classList={{
            active: onCalendarPanel() == CalendarPanelEnum.calendarManager,
          }}
        >
          Gestion des calendriers
        </button>
        <button
          onClick={switchCalendarPanel}
          class="page-title"
          classList={{
            active: onCalendarPanel() == CalendarPanelEnum.schoolCalendar,
          }}
        >
          Calendrier scolaire
        </button>
      </div>

      <Show when={!displayedSpinningWheel()}>
        <Switch>
          <Match when={onCalendarPanel() == CalendarPanelEnum.calendarManager}>
            <CalendarTable
              currentMonth={currentMonth()}
              calendars={calendars()}
            />

            <Show when={currentCalendar() != undefined}>
              <CalendarEdition
                calendar={currentCalendar() as CalendarType}
                currentMonth={currentMonth()}
              />
            </Show>
          </Match>

          <Match when={onCalendarPanel() == CalendarPanelEnum.schoolCalendar}>
            <SchoolCalendar />
          </Match>
        </Switch>
      </Show>
    </section>
  );
}
