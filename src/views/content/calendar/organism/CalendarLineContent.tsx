import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarLineName } from "../molecule/CalendarLineName";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import {
  calendarsPeriod,
  currentCalendar,
  onCalendarsPeriod,
  setCurrentCalendar,
  setOnCalendarsPeriod,
} from "../template/Calendar";
import "./CalendarLineContent.css";

interface CalendarLineContentProps {
  month: Date;
  calendar?: CalendarType;
  calendarPeriod?: CalendarPeriodType;
}

// * Why calendar? & calendarPeriod? is possible undefine ? to avoid to have multiple relatively same component
export function CalendarLineContent(props: CalendarLineContentProps) {
  const calendar = () => props.calendar;
  const calendarPeriod = () => {
    if (props.calendar)
      return calendarsPeriod().find(
        (item) => item.id == calendar()?.calendarPeriodId
      );
    else return props.calendarPeriod;
  };

  function onClick() {
    if (props.calendar) setCurrentCalendar(props.calendar);
    else setOnCalendarsPeriod(props.calendarPeriod);
  }

  function isActiveLine(): boolean {
    if (props.calendar) return currentCalendar()?.id == props.calendar?.id;
    else return onCalendarsPeriod()?.id == calendarPeriod()?.id;
  }

  function displayName(): string {
    if (props.calendar) return props.calendar?.name;
    else if (props.calendarPeriod) return calendarPeriod()?.name as string;
    else return "No name";
  }

  return (
    <div
      class="calendar-line-content"
      onClick={onClick}
      classList={{ active: isActiveLine() }}
    >
      <CalendarLineName name={displayName()} />
      <CalendarMonthsDetails
        month={props.month}
        calendar={props.calendar}
        calendarPeriod={calendarPeriod()}
        coloredCell={!!props.calendarPeriod}
      />
    </div>
  );
}
