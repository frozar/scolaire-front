import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import Button from "../../../../component/atom/Button";
import {
  disableSpinningWheel,
  displayedSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { CalendarEdition } from "../organism/CalendarEdtion";
import { CalendarPeriod } from "../organism/CalendarPeriod";
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

export const [calendarsPeriod, setCalendarsPeriod] = createSignal<
  CalendarPeriodType[]
>([]);

export const [currentMonth, setCurrentMonth] = createSignal<Date>(new Date());
export const [calendars, setCalendars] = createSignal<CalendarType[]>([]);
export const [currentCalendar, setCurrentCalendar] =
  createSignal<CalendarType>();

enum CalendarPanelEnum {
  calendarManager,
  schoolCalendar,
}

export const [onCalendarPanel, setOnCalendarPanel] =
  createSignal<CalendarPanelEnum>(CalendarPanelEnum.calendarManager);

export function Calendar() {
  enableSpinningWheel();

  onMount(async () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
    setCalendars(await CalendarService.getAll());
    setCalendarsPeriod(await CalendarService.getAllCalendarPeriod());
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
        <Button
          label="Gestion des calendriers"
          onClick={switchCalendarPanel}
          active={onCalendarPanel() == CalendarPanelEnum.calendarManager}
          variant="borderless"
          size="3xl"
        />

        <Button
          label="Calendrier scolaire"
          onClick={switchCalendarPanel}
          active={onCalendarPanel() == CalendarPanelEnum.schoolCalendar}
          variant="borderless"
          size="3xl"
        />
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
            <CalendarPeriod date={currentMonth()} />
          </Match>
        </Switch>
      </Show>
    </section>
  );
}
