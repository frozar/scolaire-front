import { createEffect, createSignal, on } from "solid-js";
import {
  HourRuleType,
  HoursType,
} from "../../../../../_entities/_utils.entity";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { CalendarUtils } from "../../../calendar/calendar.utils";
import { HourRuleItemHeader } from "../molecule/HourRuleItemHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailsItem, setSchoolDetailsItem } from "./SchoolDetails";

interface HourRuleProps {
  rule: HourRuleType;
  hours: HoursType;
  disabled?: boolean;
  action: "add" | "remove";
}

export function HourRuleItem(props: HourRuleProps) {
  const ruleIndex = () =>
    props.hours.rules.findIndex((item) => item.day == props.rule.day);
  // eslint-disable-next-line solid/reactivity
  const [bufferRule, setBufferRule] = createSignal<HourRuleType>(props.rule);

  // * Update SchoolDetailsItem only if we are not in add mode
  createEffect(
    on(
      () => bufferRule,
      () => {
        if (bufferRule() && ruleIndex() != -1 && props.action != "add") {
          if (schoolDetailsItem()?.hours.rules[ruleIndex()] != bufferRule()) {
            // eslint-disable-next-line solid/reactivity
            setSchoolDetailsItem((prev) => {
              if (!prev) return prev;
              const school = { ...prev };
              school.hours.rules[ruleIndex()] = bufferRule();
              return school;
            });
          }
        }
      }
    )
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
    const hours = schoolDetailsItem()?.hours as HoursType;
    const usedDays = hours.rules.map((item) => item.day);

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

  function onClickAdd() {
    if (!isValid()) return;
    // eslint-disable-next-line solid/reactivity
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      const school = { ...prev };
      school.hours.rules.push(bufferRule());
      return school;
    });
    SchoolUtils.update(schoolDetailsItem() as SchoolType);
  }

  // TODO to finish
  function onClickRemove() {
    // eslint-disable-next-line solid/reactivity
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      const school = { ...prev };
      school.hours.rules = school.hours.rules.filter(
        (item) => item.day != props.rule.day
      );
      return school;
    });
    SchoolUtils.update(schoolDetailsItem() as SchoolType);
  }

  return (
    <div class="mb-3 border-dark-teal border-b-[1px]">
      <HourRuleItemHeader
        action={props.action}
        onChangeDay={onChangeDay}
        rule={props.rule}
        onClickAdd={onClickAdd}
        onClickRemove={onClickRemove}
        disabled={props.disabled}
      />
      <TimesInputWrapper
        label="Aller"
        startValue={GradeEntity.getStringFromHourFormat(
          bufferRule().startComing
        )}
        endValue={GradeEntity.getStringFromHourFormat(bufferRule().endComing)}
        onInputStart={onInputComingStart}
        onInputEnd={onInputComingEnd}
        disabled={props.disabled ?? false}
      />
      <TimesInputWrapper
        label="Retour"
        startValue={GradeEntity.getStringFromHourFormat(
          bufferRule().startGoing
        )}
        endValue={GradeEntity.getStringFromHourFormat(bufferRule().endGoing)}
        onInputStart={onInputGoingStart}
        onInputEnd={onInputGoingEnd}
        disabled={props.disabled ?? false}
      />
    </div>
  );
}
