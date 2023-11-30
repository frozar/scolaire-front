import { Accessor, For, Setter, Show } from "solid-js";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { HourRuleItem } from "./HourRuleItem";

interface HourRuleListProps {
  // calendar: CalendarType;
  // hours: HoursType;
  disabled: boolean;
  item: Accessor<SchoolType | GradeType | undefined>;
  setItem: Setter<SchoolType | GradeType>;
}

export function HourRuleList(props: HourRuleListProps) {
  const item = () => props.item();

  const { startHourComing, endHourComing, startHourGoing, endHourGoing } =
    // eslint-disable-next-line solid/reactivity
    item()?.hours ?? TimeUtils.defaultHours();

  const bufferRule = {
    day: CalendarDayEnum.monday,
    startComing: startHourComing,
    endComing: endHourComing,
    startGoing: startHourGoing,
    endGoing: endHourGoing,
  };

  const showTitle = () =>
    (item()?.hours.rules.length ?? 0) > 0 || props.disabled;

  return (
    <>
      <Show when={showTitle()}>
        <p class="font-bold">Exception horaires</p>
      </Show>

      <div class="list-wrapper pr-3">
        <For each={item()?.hours.rules}>
          {(item) => (
            <HourRuleItem
              item={props.item}
              setItem={props.setItem}
              // calendar={props.calendar}
              rule={item}
              // hours={props.hours}
              disabled={props.disabled}
              action="remove"
            />
          )}
        </For>
        <Show when={props.disabled}>
          <HourRuleItem
            item={props.item}
            setItem={props.setItem}
            // calendar={props.calendar}
            rule={bufferRule}
            // hours={props.hours}
            action="add"
            disabled={props.disabled}
          />
        </Show>
      </div>
    </>
  );
}
