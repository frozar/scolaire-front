import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import { CalendarActionsEnum } from "../template/Calendar";
import "./CalendarLineContent.css";

interface CalendarLineActionProps {
  actionName: string;
  month: Date;
  calendar: CalendarType;
  onClickCell: (cellDate: Date) => void;
  action?: CalendarActionsEnum;
  calendarPeriod?: CalendarPeriodType;
  coloredCell?: boolean;
}

export function CalendarLineAction(props: CalendarLineActionProps) {
  return (
    <div class="calendar-line-content">
      <div class="calendar-line-name">{props.actionName}</div>
      <CalendarMonthsDetails
        month={props.month}
        calendar={props.calendar}
        action={props.action}
        onClickAction={props.onClickCell}
        calendarPeriod={props.calendarPeriod}
        coloredCell={props.coloredCell}
      />
    </div>
  );
}
