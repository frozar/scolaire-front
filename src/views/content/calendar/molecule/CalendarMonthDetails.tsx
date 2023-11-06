import { For } from "solid-js";
import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarUtils } from "../calendar.utils";
import { CalendarDayCell } from "./CalendarDayCell";
import "./CalendarMonthDetails.css";

export function CalendarMonthDetails(props: {
  month: Date;
  calendar: CalendarType;
}) {
  return (
    <div class="calendar-month-details">
      <For each={CalendarUtils.getDaysOfMonth(props.month)}>
        {(date) => <CalendarDayCell date={date} calendar={props.calendar} />}
      </For>
    </div>
  );
}
