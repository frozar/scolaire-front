import {
  Accessor,
  Setter,
  Show,
  createEffect,
  createSignal,
  on,
} from "solid-js";
import { HourRuleType } from "../../../../../_entities/_utils.entity";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { CalendarUtils } from "../../../calendar/calendar.utils";
import { HourRuleItemHeader } from "../molecule/HourRuleItemHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import "./HourRuleItem.css";

interface HourRuleProps {
  rule: HourRuleType;
  disabled?: boolean;
  remainingDays: () => CalendarDayEnum[];
  isNotLast?: boolean;
  item: Accessor<SchoolType | GradeType | undefined>;
  setItem: Setter<SchoolType | GradeType>;
}

export function HourRuleItem(props: HourRuleProps) {
  const ruleIndex = () =>
    props
      .item()
      ?.hours.rules.findIndex((item) => item.day == props.rule.day) as number;

  // eslint-disable-next-line solid/reactivity
  const [bufferRule, setBufferRule] = createSignal<HourRuleType>(props.rule);

  // TODO: Adapt modification to work with grades
  // * Update SchoolDetailsItem only if we are not in add mode
  createEffect(
    on(bufferRule, () => {
      if (ruleIndex() != -1) {
        if (props.item()?.hours.rules[ruleIndex()] != bufferRule()) {
          // eslint-disable-next-line solid/reactivity
          props.setItem((prev) => {
            if (!prev) return prev;
            const school = { ...prev };
            school.hours.rules[ruleIndex()] = bufferRule();
            return school;
          });
        }
      }
    })
  );

  function onInputComingStart(value: string) {
    setBufferRule((prev) => {
      return { ...prev, startComing: TimeUtils.getHourFormatFromString(value) };
    });
  }

  function onInputComingEnd(value: string) {
    setBufferRule((prev) => {
      return { ...prev, endComing: TimeUtils.getHourFormatFromString(value) };
    });
  }

  function onInputGoingStart(value: string) {
    setBufferRule((prev) => {
      return { ...prev, startGoing: TimeUtils.getHourFormatFromString(value) };
    });
  }

  function onInputGoingEnd(value: string) {
    setBufferRule((prev) => {
      return { ...prev, endGoing: TimeUtils.getHourFormatFromString(value) };
    });
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
    setBufferRule((prev) => {
      return { ...prev, day: value as CalendarDayEnum };
    });
  }

  function isValid(): boolean {
    const usedDays = props
      .item()
      ?.hours.rules.map((item) => item.day) as string[];

    if (!Object.values(CalendarDayEnum).includes(bufferRule().day)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        content: "Veuillez sélectionner un jour.",
      });
      return false;
    }
    if (usedDays.includes(bufferRule().day)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        content:
          "Veuillez sélectionner un jour autre que " +
          CalendarUtils.dayToFrench(bufferRule().day) +
          ", ce jour est déjà utiliser comme exception.",
      });
      return false;
    }
    return true;
  }

  // TODO: Adapt modification to work with grades
  function onClickAdd() {
    if (!isValid()) return;
    // eslint-disable-next-line solid/reactivity
    props.setItem((prev) => {
      if (!prev) return prev;
      const school = { ...prev };
      school.hours.rules.push(bufferRule());
      return school;
    });
  }

  // TODO: Adapt modification to work with grades
  function onClickRemove() {
    // eslint-disable-next-line solid/reactivity
    props.setItem((prev) => {
      if (!prev) return prev;
      const school = { ...prev };
      school.hours.rules = school.hours.rules.filter(
        (item) => item.day != props.rule.day
      );
      return school;
    });
  }

  function tripType(): number {
    return props
      .item()
      ?.calendar?.rules.filter((rule) => rule.day == props.rule.day)[0]
      .tripTypeId as number;
  }

  return (
    <div
      class={"hour-rule-item"}
      classList={{ "hour-rule-item-bordered": props.isNotLast }}
    >
      <HourRuleItemHeader
        onChangeDay={onChangeDay}
        rule={props.rule}
        onClickAdd={onClickAdd}
        onClickRemove={onClickRemove}
        disabled={!props.disabled}
        remainingDays={props.remainingDays}
      />

      <Show when={tripType() == 1 || tripType() == 2}>
        <TimesInputWrapper
          label="Aller"
          startValue={bufferRule().startComing}
          endValue={bufferRule().endComing}
          onInputStart={onInputComingStart}
          onInputEnd={onInputComingEnd}
          disabled={!props.disabled}
        />
      </Show>

      <Show when={tripType() == 1 || tripType() == 3}>
        <TimesInputWrapper
          label="Retour"
          startValue={bufferRule().startGoing}
          endValue={bufferRule().endGoing}
          onInputStart={onInputGoingStart}
          onInputEnd={onInputGoingEnd}
          disabled={!props.disabled}
        />
      </Show>
    </div>
  );
}
