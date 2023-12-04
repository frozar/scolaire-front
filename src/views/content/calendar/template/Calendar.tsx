import {
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { InitService } from "../../../../_services/init.service";
import {
  disableSpinningWheel,
  displayedSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { CalendarPanelsActions } from "../molecule/CalendarPanelsActions";
import { CalendarEdition } from "../organism/CalendarEdtion";
import { CalendarPeriod } from "../organism/CalendarPeriod";
import { CalendarTable } from "../organism/CalendarTable";
import "./Calendar.css";

export enum CalendarActionsEnum {
  add = "add",
  remove = "remove",
  rules = "rules",
  period = "period",
}

export enum CalendarPanelEnum {
  calendarManager,
  schoolCalendar,
}

export const [onCalendarsPeriod, setOnCalendarsPeriod] =
  createSignal<CalendarPeriodType>();
export const [calendarsPeriod, setCalendarsPeriod] = createSignal<
  CalendarPeriodType[]
>([]);

export const [currentMonth, setCurrentMonth] = createSignal<Date>(new Date());
export const [calendars, setCalendars] = createSignal<CalendarType[]>([]);
export const [currentCalendar, setCurrentCalendar] =
  createSignal<CalendarType>();

export const [onCalendarPanel, setOnCalendarPanel] =
  createSignal<CalendarPanelEnum>(CalendarPanelEnum.calendarManager);

export function Calendar() {
  enableSpinningWheel();

  createEffect(() => {
    if (calendarsPeriod().length > 0)
      setOnCalendarsPeriod(calendarsPeriod()[0]);
  });

  onMount(async () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
    if (calendars().length == 0) await InitService.loadCalendars();
    disableSpinningWheel();
  });

  return (
    <section class="page-layout">
      <CalendarPanelsActions />

      <Show when={!displayedSpinningWheel()}>
        <Switch>
          <Match when={onCalendarPanel() == CalendarPanelEnum.calendarManager}>
            <CalendarTable
              currentMonth={currentMonth()}
              calendars={calendars()}
            />

            <Show when={currentCalendar()}>
              <CalendarEdition
                calendar={currentCalendar() as CalendarType}
                currentMonth={currentMonth()}
              />
            </Show>
          </Match>

          <Match when={onCalendarPanel() == CalendarPanelEnum.schoolCalendar}>
            <CalendarPeriod
              date={currentMonth()}
              calendarPeriod={onCalendarsPeriod() as CalendarPeriodType}
            />
          </Match>
        </Switch>
      </Show>
    </section>
  );
}
