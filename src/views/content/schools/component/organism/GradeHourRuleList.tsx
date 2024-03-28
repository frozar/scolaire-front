import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../../_entities/calendar.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";

import { HourRuleType } from "../../../../../_entities/_utils.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { HourRuleItem } from "./HourRuleItem";
import "./HourRuleList.css";

interface GradeHourRuleListProps {
  rules: HourRuleType[];
  calendar: CalendarType;
  onUpdate: (rules: HourRuleType[]) => void;
  enabled: boolean;
}

//TODO passer de bout à bout le Grade
export function GradeHourRuleList(props: GradeHourRuleListProps) {
  const [localRules, setLocalRules] = createSignal<HourRuleType[]>([]);

  createEffect(() => {
    setLocalRules([...props.rules]);
  });

  onMount(() => {
    if (props.rules.length > 0) {
      setLocalRules(props.rules);
    }
  });

  const showTitle = () => (localRules()?.length ?? 0) > 0 || props.enabled;

  function getRemainingDays(): CalendarDayEnum[] {
    return TimeUtils.getRemainingRuleDays(localRules(), props.calendar);
  }

  function addRule() {
    setLocalRules((prev) => {
      const remainingDays = TimeUtils.getRemainingRuleDays(
        prev,
        props.calendar
      );
      if (remainingDays.length > 0) {
        prev.push(TimeUtils.defaultRule(remainingDays[0]));
      }
      return prev;
    });
    props.onUpdate(localRules());
  }

  function onRuleUpdate(rule: HourRuleType, index: number) {
    setLocalRules((prev) => {
      prev[index] = { ...rule };
      return prev;
    });
    console.log("rulelist upadte", localRules());

    props.onUpdate(localRules());
  }

  function onRuleRemove(index: number) {
    setLocalRules((prev) => {
      prev.splice(index, 1);
      return prev;
    });
    props.onUpdate(localRules());
  }

  return (
    <>
      <div class="flex">
        <Show when={showTitle()}>
          <p class="hour-rule-list-title">Exception(s)</p>
        </Show>
        <Show when={props.enabled && getRemainingDays().length > 0}>
          <ButtonIcon icon={<PlusIcon />} onClick={addRule} class="pl-3 pt-1" />
        </Show>
      </div>
      <div
        class="list-wrapper pr-3"
        classList={{ "!max-h-full": props.enabled }}
      >
        <For each={localRules()}>
          {(hourRule, i) => (
            <HourRuleItem
              rule={hourRule}
              calendar={props.calendar}
              onUpdate={(rule) => {
                onRuleUpdate(rule, i());
              }}
              onRemove={() => onRuleRemove(i())}
              remainingDays={getRemainingDays}
              disabled={props.enabled}
              isNotLast={i() + 1 != localRules().length}
            />
          )}
        </For>
      </div>
    </>
  );
}
