import { For } from "solid-js";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { calendarsPeriod } from "../template/Calendar";
import "./CalendarPeriodSelector.css";

interface CalendarPeriodSelectorProps {
  defaultValue?: number;
  onChange: (calendarPeriod: CalendarPeriodType | undefined) => void;
}

export function CalendarPeriodSelector(props: CalendarPeriodSelectorProps) {
  function onChange(event: Event & { target: HTMLSelectElement }) {
    const value = Number(event.target.value);
    const calendarPeriod = calendarsPeriod().find((item) => item.id == value);
    props.onChange(calendarPeriod);
  }

  return (
    <select onChange={onChange} class="selector">
      <option value="default">Choisir un calendrier scolaire</option>
      <For each={calendarsPeriod()}>
        {(calendar) => (
          <option
            value={calendar.id}
            selected={props.defaultValue == calendar.id}
          >
            {calendar.name}
          </option>
        )}
      </For>
    </select>
  );
}
