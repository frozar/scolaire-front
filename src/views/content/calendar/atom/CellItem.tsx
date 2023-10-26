import { CalendarType } from "../template/Calendar";
import "./CellItem.css";

export default function (props: { calendar: CalendarType }) {
  function onClick() {
    console.log(props.calendar.calendarName);
  }

  return <div class="cell-item" onClick={onClick} />;
}
