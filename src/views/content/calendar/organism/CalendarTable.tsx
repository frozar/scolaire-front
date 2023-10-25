import CalendarContent from "./CalendarContent";
import { CalendarHeader } from "./CalendarHeader";

import "./CalendarTable.css";

export function CalendarTable(props: { currentMonth: Date }) {
  return (
    <div class="calendar-table">
      <CalendarHeader month={props.currentMonth} />
      <CalendarContent month={props.currentMonth} />
      {/* CalendarAdd */}
    </div>
  );
}
