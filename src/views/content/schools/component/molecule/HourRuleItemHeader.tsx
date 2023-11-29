import { Match, Show, Switch } from "solid-js";
import { HourRuleType } from "../../../../../_entities/_utils.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import PlusIcon from "../../../../../icons/PlusIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CalendarUtils } from "../../../calendar/calendar.utils";
import {
  schoolDetailEditing,
  schoolDetailsItem,
} from "../organism/SchoolDetails";

import "./HourRuleItemHeader.css";

interface HourRuleItemHeader {
  onChangeDay: (value: string | number) => void;
  onClickAdd: () => void;
  onClickRemove: () => void;
  disabled?: boolean;
  action: "add" | "remove";
  rule: HourRuleType;
}

export function HourRuleItemHeader(props: HourRuleItemHeader) {
  const selectOptions = schoolDetailsItem()?.calendar?.rules.map((item) => {
    return {
      text: CalendarUtils.dayToFrench(item.day),
      value: item.day,
    };
  }) as [];

  return (
    <div class="rule-item-header">
      <SelectInput
        options={selectOptions}
        onChange={props.onChangeDay}
        defaultValue={props.rule.day}
        disabled={props.disabled ?? false}
        defaultOptions="Jour"
      />

      <Show when={schoolDetailEditing()}>
        <Switch>
          <Match when={props.action == "add"}>
            <ButtonIcon icon={<PlusIcon />} onClick={props.onClickAdd} />
          </Match>
          <Match when={props.action == "remove"}>
            <ButtonIcon icon={<TrashIcon />} onClick={props.onClickRemove} />
          </Match>
        </Switch>
      </Show>
    </div>
  );
}