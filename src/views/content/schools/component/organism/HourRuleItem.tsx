/* eslint-disable solid/reactivity */
import { createEffect, createSignal } from "solid-js";
import {
  HourRuleType,
  HoursType,
} from "../../../../../_entities/_utils.entity";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
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
  const [bufferRule, setBufferRule] = createSignal<HourRuleType>(props.rule);

  // * Update SchoolDetailsItem only if we are not in add mode
  createEffect(() => {
    if (bufferRule() && ruleIndex() != -1) {
      if (props.action != "add") {
        if (schoolDetailsItem()?.hours.rules[ruleIndex()] != bufferRule()) {
          setSchoolDetailsItem((prev) => {
            if (!prev) return prev;
            const school = { ...prev };
            school.hours.rules[ruleIndex()] = bufferRule();
            return school;
          });
        }
      }
    }
  });

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
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      const school = { ...prev };
      school.hours.rules[ruleIndex()].day = value as CalendarDayEnum;
      return school;
    });
  }

  function onClickAdd() {
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
    console.log("remove");
  }

  return (
    <div class="mb-3 border-dark-teal border-b-[1px]">
      <HourRuleItemHeader
        action={props.action}
        onChangeDay={onChangeDay}
        rule={props.rule}
        onClickAdd={onClickAdd}
        onClickRemove={onClickRemove}
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
