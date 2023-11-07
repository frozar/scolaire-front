import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import "./CalendarLineContent.css";

export function CalendarLineAction(props: {
  actionName: string;
  month: Date;
  calendar: CalendarType;
  onClickCell: (cellDate: Date) => void;
  action?: "add" | "remove";
}) {
  return (
    <div class="calendar-line-content">
      <div class="calendar-line-name">{props.actionName}</div>
      <CalendarMonthsDetails
        month={props.month}
        calendar={{
          ...props.calendar,
        }}
        action={props.action}
        onClickAction={props.onClickCell}
      />
    </div>
  );
}
