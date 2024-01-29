import { Show } from "solid-js";
import { HourRuleType } from "../../../../../_entities/_utils.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CalendarUtils } from "../../../calendar/calendar.utils";

import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";

import "./HourRuleItemHeader.css";

interface HourRuleItemHeader {
  onChangeDay: (value: string | number) => void;
  onClickAdd: () => void;
  onClickRemove: () => void;
  disabled?: boolean;
  remainingDays: () => CalendarDayEnum[];
  rule: HourRuleType;
}

export function HourRuleItemHeader(props: HourRuleItemHeader) {
  const selectOptions = () => {
    const remainingDays = props.remainingDays().map((remainingDay) => {
      return {
        text: CalendarUtils.dayToFrench(remainingDay),
        value: remainingDay,
      };
    });
    // Add actually selected day
    remainingDays.push({
      text: CalendarUtils.dayToFrench(props.rule.day),
      value: props.rule.day,
    });
    return remainingDays;
  };

  return (
    <div class="rule-item-header">
      <SelectInput
        options={selectOptions()}
        onChange={props.onChangeDay}
        defaultValue={props.rule.day}
        disabled={props.disabled ?? false}
        dontTriggerCreateEffect={false}
      />

      <Show when={!props.disabled}>
        <ButtonIcon icon={<TrashIcon />} onClick={props.onClickRemove} />
      </Show>
    </div>
  );
}
