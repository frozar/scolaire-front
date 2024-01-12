import { Accessor, For, Setter, Show } from "solid-js";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { HourRuleItem } from "./HourRuleItem";
import "./HourRuleList.css";

interface HourRuleListProps {
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
        <p class="hour-rule-list-title">Exception(s)</p>
      </Show>

      <div class="list-wrapper pr-3">
        <For each={item()?.hours.rules}>
          {(hourRule, i) => (
            <HourRuleItem
              item={props.item}
              setItem={props.setItem}
              rule={hourRule}
              disabled={props.disabled}
              action="remove"
              isNotLast={i() + 1 != item()?.hours.rules.length}
            />
          )}
        </For>
        <Show when={props.disabled}>
          <HourRuleItem
            item={props.item}
            setItem={props.setItem}
            rule={bufferRule}
            action="add"
            disabled={props.disabled}
          />
        </Show>
      </div>
    </>
  );
}
