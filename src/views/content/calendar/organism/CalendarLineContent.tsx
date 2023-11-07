import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarLineName } from "../molecule/CalendarLineName";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import { currentCalendar } from "../template/Calendar";
import "./CalendarLineContent.css";

export function CalendarLineContent(props: {
  month: Date;
  calendar: CalendarType;
}) {
  return (
    <div
      class="calendar-line-content"
      classList={{
        active: currentCalendar()?.id == props.calendar.id,
      }}
    >
      <CalendarLineName calendar={props.calendar} />
      <CalendarMonthsDetails month={props.month} calendar={props.calendar} />
    </div>
  );
}
