import { NextMonth } from "../atom/NextMonth";
import { PreviousMonth } from "../atom/PreviousMonth";
import "./CalendarHeader.css";
import MonthList from "./MonthList";

export function CalendarHeader(props: { month: Date }) {
  return (
    <div class="calendar-header">
      <div class="calendar-header-actions">
        <PreviousMonth month={props.month} />
        <NextMonth month={props.month} />
      </div>
      <MonthList month={props.month} />
    </div>
  );
}
