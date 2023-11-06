import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarLineName } from "../molecule/CalendarLineName";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import "./CalendarLineContent.css";

export function CalendarLineContent(props: {
  month: Date;
  calendar: CalendarType;
}) {
  return (
    <div class="calendar-line-content">
      <CalendarLineName calendar={props.calendar} />
      <CalendarMonthsDetails month={props.month} calendar={props.calendar} />
    </div>
  );
}
