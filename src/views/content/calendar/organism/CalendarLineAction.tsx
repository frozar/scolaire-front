import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import "./CalendarLineContent.css";

export function CalendarLineAction(props: {
  actionName: string;
  month: Date;
  calendar: CalendarType;
  onClickCell: (cellDate: Date) => void;
}) {
  return (
    <div class="calendar-line-content">
      <div class="calendar-line-name">{props.actionName}</div>
      <CalendarMonthsDetails
        month={props.month}
        calendar={{
          ...props.calendar,
        }}
        action="add"
        onClickAction={props.onClickCell}
      />
    </div>
  );
}
