import { For } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";

import { CalendarRuleItem } from "./CalendarRuleItem";
import "./CalendarRules.css";

interface CalendarDaysCheckboxProps {
  calendar: CalendarType;
}

export function CalendarRules(props: CalendarDaysCheckboxProps) {
  return (
    <div class="calendar-rules-list">
      <div class="calendar-rules-actions-list">
        <p>aller/retour</p>
        <p>aller</p>
        <p>retour</p>
      </div>
      <For each={Object.keys(CalendarDayEnum)}>
        {(enumeredDay) => (
          <CalendarRuleItem
            day={enumeredDay as CalendarDayEnum}
            calendar={props.calendar}
          />
        )}
      </For>
    </div>
  );
}
