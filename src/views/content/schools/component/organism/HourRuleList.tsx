import { Accessor, For, Setter, Show } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../../_entities/calendar.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { HourRuleItem } from "./HourRuleItem";

import { schoolDetailEditing } from "../template/SchoolDetails";
import "./HourRuleList.css";

interface HourRuleListProps {
  enabled: boolean;
  item: Accessor<SchoolType | undefined>;
  setItem: Setter<SchoolType>;
}

export function HourRuleList(props: HourRuleListProps) {
  const item = () => props.item();

  const showTitle = () =>
    (item()?.hours.rules.length ?? 0) > 0 || props.enabled;

  function getRemainingDays(): CalendarDayEnum[] {
    return TimeUtils.getRemainingDays(props.item());
  }

  // TODO: Adapt modification to work with grades
  function addRule() {
    // eslint-disable-next-line solid/reactivity
    props.setItem((prev) => {
      const school: SchoolType = { ...prev } as SchoolType;

      const defaultRule = TimeUtils.defaultRule(getRemainingDays()[0]);
      school.hours.rules.push(defaultRule);
      return school;
    });
  }

  return (
    <>
      <div class="flex">
        <Show when={showTitle()}>
          <p class="hour-rule-list-title">Exception(s)</p>
        </Show>
        <Show when={schoolDetailEditing() && getRemainingDays().length > 0}>
          <ButtonIcon icon={<PlusIcon />} onClick={addRule} class="pl-3 pt-1" />
        </Show>
      </div>

      <div
        class="list-wrapper pr-3"
        classList={{ "!max-h-full": schoolDetailEditing() }}
      >
        <For each={item()?.hours.rules}>
          {(hourRule, i) => (
            <HourRuleItem
              calendar={item()?.calendar as CalendarType}
              onRemove={() => console.log()}
              onUpdate={() => console.log()}
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
