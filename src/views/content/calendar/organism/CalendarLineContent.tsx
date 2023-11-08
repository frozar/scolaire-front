import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarLineName } from "../molecule/CalendarLineName";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import { currentCalendar, setCurrentCalendar } from "../template/Calendar";
import "./CalendarLineContent.css";

export function CalendarLineContent(props: {
  month: Date;
  calendar: CalendarType;
}) {
  function onClick() {
    setCurrentCalendar(props.calendar);
  }

  return (
    <div
      class="calendar-line-content"
      classList={{
        active: currentCalendar()?.id == props.calendar.id,
      }}
      onClick={onClick}
    >
      <CalendarLineName calendar={props.calendar} />
      <CalendarMonthsDetails month={props.month} calendar={props.calendar} />
    </div>
  );
}
