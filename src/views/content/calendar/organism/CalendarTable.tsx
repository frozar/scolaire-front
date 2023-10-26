import CalendarContent from "./CalendarContent";
import { CalendarHeader } from "./CalendarHeader";

import CalendarNameList from "../molecule/CalendarNameList";
import { CalendarType } from "../template/Calendar";
import "./CalendarTable.css";

export function CalendarTable(props: {
  currentMonth: Date;
  calendarsJson: CalendarType[];
}) {
  return (
    <div class="calendar-table flex items-end">
      <CalendarNameList calendarsJson={props.calendarsJson} />
      <div>
        <CalendarHeader month={props.currentMonth} />
        <CalendarContent
          month={props.currentMonth}
          calendars={props.calendarsJson}
        />
      </div>
      {/* CalendarAdd */}
    </div>
  );
}
