import { For } from "solid-js";
import { CalendarType } from "../template/Calendar";
import "./CalendarNameList.css";

export default function (props: { calendarsJson: CalendarType[] }) {
  return (
    <div class="calendar-names">
      <For each={props.calendarsJson}>
        {(calendarDatas) => (
          <p class="calendar-name-item">{calendarDatas.calendarName}</p>
        )}
      </For>
    </div>
  );
}
