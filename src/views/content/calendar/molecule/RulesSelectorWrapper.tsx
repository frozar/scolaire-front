import { For } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { CalendarUtils } from "../calendar.utils";

interface RulesSelectorWrapperProps {
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

export function RulesSelectorWrapper(props: RulesSelectorWrapperProps) {
  return (
    <div class="flex items-center">
      <select
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.target.value)}
        class="h-fit"
      >
        <For each={Object.keys(CalendarDayEnum)}>
          {(enumeredDay) => (
            <option
              value={enumeredDay}
              selected={enumeredDay == (props.defaultValue as CalendarDayEnum)}
            >
              {CalendarUtils.dayToFrench(enumeredDay as CalendarDayEnum)}
            </option>
          )}
        </For>
      </select>
    </div>
  );
}
