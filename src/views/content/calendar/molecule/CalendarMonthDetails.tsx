import { For } from "solid-js";
import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarUtils } from "../calendar.utils";
import { CalendarActionsEnum } from "../template/Calendar";
import { CalendarDayCell } from "./CalendarDayCell";
import "./CalendarMonthDetails.css";

interface CalendarMonthDetailsProps {
  month: Date;
  calendar: CalendarType;
  action?: CalendarActionsEnum;
  onClickAction?: (date: Date) => void;
}

export function CalendarMonthDetails(props: CalendarMonthDetailsProps) {
  return (
    <div class="calendar-month-details">
      <For each={CalendarUtils.getDaysOfMonth(props.month)}>
        {(date) => (
          <CalendarDayCell
            date={date}
            calendar={props.calendar}
            action={props.action}
            onClickAction={props.onClickAction}
          />
        )}
      </For>
    </div>
  );
}
