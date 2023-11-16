import { For } from "solid-js";
import { CalendarType } from "../../../../_entities/calendar.entity";
import "./CalendarContent.css";
import { CalendarLineContent } from "./CalendarLineContent";

export function CalendarContent(props: {
  month: Date;
  calendars: CalendarType[];
}) {
  return (
    <For each={props.calendars}>
      {(calendar) => (
        <div class="calendar-cells">
          <CalendarLineContent
            month={props.month}
            calendar={calendar}
            displayIcon={true}
          />
        </div>
      )}
    </For>
  );
}
