import { CalendarType } from "../../../../_entities/calendar.entity";
import "./CalendarLineName.css";

export function CalendarLineName(props: { calendar: CalendarType }) {
  return <div class="calendar-line-name">{props.calendar.name}</div>;
}
