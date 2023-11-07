import { CalendarContent } from "./CalendarContent";
import { CalendarHeader } from "./CalendarHeader";

import { CalendarType } from "../../../../_entities/calendar.entity";
import "./CalendarTable.css";

export function CalendarTable(props: {
  currentMonth: Date;
  calendars: CalendarType[];
}) {
  return (
    <div class="calendar-table calendar-list">
      <p class="calendar-edition-title">Liste des calendrier</p>
      <CalendarHeader month={props.currentMonth} />
      <CalendarContent month={props.currentMonth} calendars={props.calendars} />
      {/* CalendarAdd */}
    </div>
  );
}
