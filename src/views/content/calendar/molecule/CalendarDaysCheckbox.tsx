import { For } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { LabeledCheckbox } from "./LabeledCheckbox";

import "./CalendarDaysCheckbox.css";

interface CalendarDaysCheckboxProps {
  calendar: CalendarType;
}

export function CalendarDaysCheckbox(props: CalendarDaysCheckboxProps) {
  return (
    <div class="calendar-checkbox-actions">
      <For each={Object.keys(CalendarDayEnum)}>
        {(enumeredDay) => (
          <LabeledCheckbox
            calendar={props.calendar}
            day={enumeredDay as CalendarDayEnum}
          />
        )}
      </For>
    </div>
  );
}
