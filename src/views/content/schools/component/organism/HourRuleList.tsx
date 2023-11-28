import { For, Show } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { HourRuleItem } from "./HourRuleItem";
import { schoolDetailEditing, schoolDetailsItem } from "./SchoolDetails";

export function HourRuleList(props: { hours: HoursType }) {
  const { startHourComing, endHourComing, startHourGoing, endHourGoing } =
    schoolDetailsItem()?.hours as HoursType;

  const bufferRule = {
    day: CalendarDayEnum.monday,
    startComing: startHourComing,
    endComing: endHourComing,
    startGoing: startHourGoing,
    endGoing: endHourGoing,
  };

  const showTitle = () =>
    (schoolDetailsItem()?.hours.rules.length ?? 0) > 0 || schoolDetailEditing();

  return (
    <>
      <Show when={showTitle()}>
        <p class="font-bold">Exception horaires</p>
      </Show>
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
        <Show when={schoolDetailEditing()}>
          <HourRuleItem rule={bufferRule} hours={props.hours} action="add" />
        </Show>
      </div>
    </>
  );
}
