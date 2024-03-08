import { Accessor, For, Setter, Show } from "solid-js";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { HourRuleItem } from "./HourRuleItem";

import { schoolDetailEditing } from "../template/SchoolDetails";
import "./HourRuleList.css";

interface GradeHourRuleListProps {
  enabled: boolean;
  item: Accessor<GradeType | undefined>;
  setItem: Setter<GradeType>;
}

export function GradeHourRuleList(props: GradeHourRuleListProps) {
  const item = () => props.item();

  const showTitle = () =>
    (item()?.hours.rules.length ?? 0) > 0 || props.enabled;

  function getRemainingDays(): CalendarDayEnum[] {
    return TimeUtils.getRemainingDays(props.item());
  }

  return (
    <>
      <div class="flex">
        <Show when={showTitle()}>
          <p class="hour-rule-list-title">Exception(s)</p>
        </Show>
        {/* <Show when={schoolDetailEditing() && getRemainingDays().length > 0}>
          <ButtonIcon icon={<PlusIcon />} onClick={addRule} class="pl-3 pt-1" />
        </Show> */}
      </div>

      <div
        class="list-wrapper pr-3"
        classList={{ "!max-h-full": schoolDetailEditing() }}
      >
        <For each={item()?.hours.rules}>
          {(hourRule, i) => (
            <HourRuleItem
              item={props.item}
              setItem={props.setItem}
              remainingDays={getRemainingDays}
              rule={hourRule}
              disabled={props.enabled}
              isNotLast={i() + 1 != item()?.hours.rules.length}
            />
          )}
        </For>
      </div>
    </>
  );
}
