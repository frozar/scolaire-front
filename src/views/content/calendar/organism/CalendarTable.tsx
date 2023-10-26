import CalendarContent from "./CalendarContent";
import { CalendarHeader } from "./CalendarHeader";

import CalendarNameList from "../molecule/CalendarNameList";
import { CalendarType } from "../template/Calendar";
import "./CalendarTable.css";

export function CalendarTable(props: {
  currentMonth: Date;
  calendars: CalendarType[];
}) {
  return (
    <div class="calendar-table flex items-end">
      <CalendarNameList calendars={props.calendars} />
      <div>
        <CalendarHeader month={props.currentMonth} />
        <CalendarContent
          month={props.currentMonth}
          calendars={props.calendars}
        />
      </div>
      {/* CalendarAdd */}
    </div>
  );
}
