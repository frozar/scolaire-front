import { For } from "solid-js";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { onCalendarsPeriod } from "../template/Calendar";
import "./CalendarContent.css";
import { CalendarLineContent } from "./CalendarLineContent";

interface CalendarPeriodContentProps {
  month: Date;
  calendarsPeriod: CalendarPeriodType[];
}

export function CalendarPeriodContent(props: CalendarPeriodContentProps) {
  // * Keep reactivity for CalendarPeriod Edition
  const calendarPeriod = (calendarPeriod: CalendarPeriodType) => {
    if (calendarPeriod.id == onCalendarsPeriod()?.id)
      return onCalendarsPeriod();
    else return calendarPeriod;
  };

  return (
    <For each={props.calendarsPeriod}>
      {(calendar) => (
        <div class="calendar-cells">
          <CalendarLineContent
            month={props.month}
            calendarPeriod={calendarPeriod(calendar)}
          />
        </div>
      )}
    </For>
  );
}
