import { For } from "solid-js";
import { CalendarType } from "../template/Calendar";
import "./CalendarContent.css";
import MonthListContent from "./MonthListContent";

export default function (props: { month: Date; calendars: CalendarType[] }) {
  return (
    <For each={props.calendars}>
      {(calendar) => (
        <div class="calendar-cells">
          <MonthListContent month={props.month} calendar={calendar} />
        </div>
      )}
    </For>
  );
}
