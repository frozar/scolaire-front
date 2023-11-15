import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarLineName } from "../molecule/CalendarLineName";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import {
  calendarsPeriod,
  currentCalendar,
  setCurrentCalendar,
} from "../template/Calendar";
import "./CalendarLineContent.css";

export function CalendarLineContent(props: {
  month: Date;
  calendar: CalendarType;
}) {
  function onClick() {
    setCurrentCalendar(props.calendar);
  }
  const calendar = () => props.calendar;

  const calendarPeriod = () =>
    calendarsPeriod().find((item) => item.id == calendar().calendarPeriodId);

  return (
    <div
      class="calendar-line-content"
      onClick={onClick}
      classList={{
        active: currentCalendar()?.id == props.calendar.id,
      }}
    >
      <CalendarLineName calendar={props.calendar} />
      <CalendarMonthsDetails
        month={props.month}
        calendar={props.calendar}
        calendarPeriod={calendarPeriod()}
        coloredCell={false}
      />
    </div>
  );
}
