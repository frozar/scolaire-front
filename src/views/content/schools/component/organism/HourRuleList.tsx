import { For } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { HourFormat } from "../../../../../_entities/grade.entity";
import { HourRuleItem } from "./HourRuleItem";
import { schoolDetailEditing } from "./SchoolDetails";

export function HourRuleList(props: { hours: HoursType }) {
  const defaultHourFormat: HourFormat = {
    hour: 7,
    minutes: 0,
  };

  const bufferRule = {
    day: CalendarDayEnum.monday,
    startComing: defaultHourFormat,
    endComing: defaultHourFormat,
    startGoing: defaultHourFormat,
    endGoing: defaultHourFormat,
  };

  return (
    <div class="list-wrapper pr-3">
      <For each={props.hours.rules}>
        {(item) => (
          <HourRuleItem
            rule={item}
            hours={props.hours}
            disabled={!schoolDetailEditing()}
            action="remove"
          />
        )}
      </For>
      <HourRuleItem rule={bufferRule} hours={props.hours} action="add" />
    </div>
  );
}
