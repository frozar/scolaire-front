import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import { CalendarHeader } from "./CalendarHeader";
import "./CalendarPeriod.css";
interface SchoolCalendarProps {
  date: Date;
  calendarPeriod: CalendarPeriodType;
}

export function CalendarPeriod(props: SchoolCalendarProps) {
  return (
    <section class="calendar-period">
      <CalendarSectionTitle title="Calendrier scolaire" />
      <CalendarHeader month={props.date} />

      <div class="calendar-period-calendar">
        <CalendarMonthsDetails
          month={props.date}
          calendarPeriod={props.calendarPeriod}
        />
      </div>
    </section>
  );
}
