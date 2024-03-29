import { Show, createEffect, createSignal } from "solid-js";
import { HourRuleType } from "../../../../../_entities/_utils.entity";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../../_entities/calendar.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { HourRuleItemHeader } from "../molecule/HourRuleItemHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import "./HourRuleItem.css";

interface HourRuleProps {
  rule: HourRuleType;
  calendar: CalendarType;
  onUpdate: (rule: HourRuleType) => void;
  onRemove: () => void;
  disabled?: boolean;
  remainingDays: () => CalendarDayEnum[];
  isNotLast?: boolean;
}

enum RuleTimeVariableEnum {
  startGoing = "startGoing",
  endGoing = "endGoing",
  startComing = "startComing",
  endComing = "endComing",
}

export function HourRuleItem(props: HourRuleProps) {
  // eslint-disable-next-line solid/reactivity
  const [localRule, setLocalRule] = createSignal<HourRuleType>(props.rule);

  createEffect(() => {
    setLocalRule({ ...props.rule });
  });

  function onInputComingStart(value: string) {
    ruleUpdateTime(value, RuleTimeVariableEnum.startComing);
  }

  function onInputComingEnd(value: string) {
    ruleUpdateTime(value, RuleTimeVariableEnum.endComing);
  }

  function onInputGoingStart(value: string) {
    ruleUpdateTime(value, RuleTimeVariableEnum.startGoing);
  }

  function onInputGoingEnd(value: string) {
    ruleUpdateTime(value, RuleTimeVariableEnum.endGoing);
  }

  function ruleUpdateTime(value: string, key: RuleTimeVariableEnum) {
    setLocalRule((prev) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prev[key] = TimeUtils.getHourFormatFromString(value);
      return prev;
    });
    props.onUpdate(localRule());
  }

  function onChangeDay(value: string | number) {
    if (!Object.values(CalendarDayEnum).includes(value as CalendarDayEnum)) {
      return addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        content: "Veuillez sélectionner un jour.",
      });
    }
    setLocalRule((prev) => {
      return { ...prev, day: value as CalendarDayEnum };
    });

    props.onUpdate(localRule());
  }

  function onClickRemove() {
    props.onRemove();
  }

  function tripType(): number {
    const rules = props.calendar?.rules.filter(
      (rule) => rule.day == props.rule.day
    );

    return rules && rules.length > 0 ? (rules[0].tripTypeId as number) : 0;
  }

  return (
    <div
      class={"hour-rule-item"}
      classList={{ "hour-rule-item-bordered": props.isNotLast }}
    >
      <HourRuleItemHeader
        onChangeDay={onChangeDay}
        rule={props.rule}
        onClickRemove={onClickRemove}
        disabled={!props.disabled}
        remainingDays={props.remainingDays}
      />

      <Show when={tripType() == 1 || tripType() == 2}>
        <TimesInputWrapper
          label="Aller"
          startValue={localRule().startComing}
          endValue={localRule().endComing}
          onInputStart={onInputComingStart}
          onInputEnd={onInputComingEnd}
          disabled={!props.disabled}
        />
      </Show>

      <Show when={tripType() == 1 || tripType() == 3}>
        <TimesInputWrapper
          label="Retour"
          startValue={localRule().startGoing}
          endValue={localRule().endGoing}
          onInputStart={onInputGoingStart}
          onInputEnd={onInputGoingEnd}
          disabled={!props.disabled}
        />
      </Show>
    </div>
  );
}
