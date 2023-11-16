import { CalendarHeader } from "./CalendarHeader";

import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarPeriodAddLine } from "./CalendarPeriodAddLine";
import { CalendarPeriodContent } from "./CalendarPeriodContent";
import "./CalendarTable.css";

interface CalendarPeriodTableProps {
  currentMonth: Date;
  calendarsPeriod: CalendarPeriodType[];
}

export function CalendarPeriodTable(props: CalendarPeriodTableProps) {
  return (
    <div class="calendar-table calendar-list">
      <CalendarSectionTitle title="Liste des calendrier" />
      <CalendarHeader month={props.currentMonth} />
      <CalendarPeriodContent
        month={props.currentMonth}
        calendarsPeriod={props.calendarsPeriod}
      />
      <CalendarPeriodAddLine month={props.currentMonth} />
    </div>
  );
}
