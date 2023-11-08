import { CalendarContent } from "./CalendarContent";
import { CalendarHeader } from "./CalendarHeader";

import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarAddLine } from "./CalendarAddLine";
import "./CalendarTable.css";

export function CalendarTable(props: {
  currentMonth: Date;
  calendars: CalendarType[];
}) {
  return (
    <div class="calendar-table calendar-list">
      <CalendarSectionTitle title="Liste des calendrier" />
      <CalendarHeader month={props.currentMonth} />
      <CalendarContent month={props.currentMonth} calendars={props.calendars} />
      <div class="calendar-cells">
        <CalendarAddLine month={props.currentMonth} />
      </div>
      {/* CalendarAdd */}
    </div>
  );
}
