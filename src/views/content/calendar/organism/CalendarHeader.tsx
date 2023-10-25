import { NextMonth } from "../atom/NextMonth";
import { PreviousMonth } from "../atom/PreviousMonth";
import "./CalendarHeader.css";
import MonthList from "./MonthList";

export function CalendarHeader(props: { month: Date }) {
  return (
    <div class="calendar-header">
      <PreviousMonth month={props.month} />
      <MonthList month={props.month} />
      <NextMonth month={props.month} />
    </div>
  );
}
