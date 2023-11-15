import { For } from "solid-js";
import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarUtils } from "../calendar.utils";
import { CalendarActionsEnum } from "../template/Calendar";
import { CalendarDayCell } from "./CalendarDayCell";
import "./CalendarMonthDetails.css";

interface CalendarMonthDetailsProps {
  month: Date;
  calendar?: CalendarType;
  calendarPeriod?: CalendarPeriodType;
  action?: CalendarActionsEnum;
  onClickAction?: (date: Date) => void;
  coloredCell?: boolean;
}

export function CalendarMonthDetails(props: CalendarMonthDetailsProps) {
  return (
    <div class="calendar-month-details">
      <For each={CalendarUtils.getDaysOfMonth(props.month)}>
        {(date) => (
          <CalendarDayCell
            date={date}
            calendarPeriod={props.calendarPeriod}
            calendar={props.calendar}
            action={props.action}
            onClickAction={props.onClickAction}
            coloredCell={props.coloredCell}
          />
        )}
      </For>
    </div>
  );
}
