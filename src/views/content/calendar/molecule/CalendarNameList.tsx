import { For } from "solid-js";
import { CalendarType } from "../template/Calendar";
import "./CalendarNameList.css";

export default function (props: { calendars: CalendarType[] }) {
  return (
    <div class="calendar-names">
      <For each={props.calendars}>
        {(calendarDatas) => (
          <p class="calendar-name-item">{calendarDatas.calendarName}</p>
        )}
      </For>
    </div>
  );
}
