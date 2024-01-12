import { Accessor, For, Setter, Show } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { HourRuleItem } from "./HourRuleItem";
import "./HourRuleList.css";
import { schoolDetailEditing } from "./SchoolDetails";

interface HourRuleListProps {
  disabled: boolean;
  item: Accessor<SchoolType | GradeType | undefined>;
  setItem: Setter<SchoolType | GradeType>;
}

// TODO: Adapt modification to work with grades
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

  function getRemainingDays(): CalendarDayEnum[] {
    const calendarDays = (
      (props.item() as SchoolType).calendar as CalendarType
    ).rules.map((rule) => rule.day);

    const alreadyUseDays = (props.item() as SchoolType).hours.rules.map(
      (rule) => rule.day
    );
    return TimeUtils.getRemainingDays(calendarDays, alreadyUseDays);
  }
  function addRule() {
    props.setItem((prev) => {
      const school: SchoolType = { ...prev } as SchoolType;

      const defaultRule = TimeUtils.defaultRule(getRemainingDays()[0]);
      const test = {
        ...school,
        hours: {
          ...school.hours,
          rules: [...school.hours.rules, defaultRule],
        },
      } as SchoolType;
      return test;
    });
  }

  return (
    <>
      {/* TODO: CLEAN */}
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
              item={props.item}
              setItem={props.setItem}
              rule={hourRule}
              disabled={props.disabled}
              action="remove"
              isNotLast={i() + 1 != item()?.hours.rules.length}
            />
          )}
        </For>
      </div>
    </>
  );
}
