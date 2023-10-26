import { For } from "solid-js";
import { CalendarType } from "../template/Calendar";
import "./CalendarContent.css";
import CellList from "./MonthListContent";

export default function (props: { month: Date; calendars: CalendarType[] }) {
  return (
    <For each={props.calendars}>
      {(calendar) => (
        <div class="calendar-cells">
          <CellList month={props.month} calendar={calendar} />
        </div>
      )}
    </For>
  );
}
