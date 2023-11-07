import { For } from "solid-js";
import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarMonthDetails } from "./CalendarMonthDetails";
import "./CalendarMonthsDetails.css";

export function CalendarMonthsDetails(props: {
  month: Date;
  calendar: CalendarType;
  action?: "add" | "remove";
  onClickAction?: (date: Date) => void;
}) {
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
          />
        )}
      </For>
    </div>
  );
}
