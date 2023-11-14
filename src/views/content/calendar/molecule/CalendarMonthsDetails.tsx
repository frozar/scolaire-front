import { For } from "solid-js";
import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarActionsEnum } from "../template/Calendar";
import { CalendarMonthDetails } from "./CalendarMonthDetails";
import "./CalendarMonthsDetails.css";

interface CalendarMonthsDetailsProps {
  month: Date;
  calendar?: CalendarType;
  calendarPeriod?: CalendarPeriodType;
  action?: CalendarActionsEnum;
  onClickAction?: (date: Date) => void;
  coloredCell?: boolean;
}

export function CalendarMonthsDetails(props: CalendarMonthsDetailsProps) {
  return (
    <div class="calendar-months-details">
      <For each={[0, 1, 2]}>
        {(index) => (
          <CalendarMonthDetails
            month={
              new Date(
                props.month.getFullYear(),
                props.month.getMonth() + index
              )
            }
            calendar={props.calendar}
            action={props.action}
            onClickAction={props.onClickAction}
            calendarPeriod={props.calendarPeriod}
            coloredCell={props.coloredCell}
          />
        )}
      </For>
    </div>
  );
}
