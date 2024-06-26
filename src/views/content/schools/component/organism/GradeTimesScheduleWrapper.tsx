import { JSXElement, createEffect, createSignal, on } from "solid-js";
import {
  HourRuleType,
  HoursType,
} from "../../../../../_entities/_utils.entity";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeEntity, GradeType } from "../../../../../_entities/grade.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { SchoolStore } from "../../../../../_stores/school.store";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { GradeHourRuleList } from "./GradeHourRuleList";

export function GradeTimesScheduleWrapper(props: {
  grade: GradeType;
  onUpdate: (hours: HoursType) => void;
}): JSXElement {
  const [localHours, setLocalHours] = createSignal<HoursType>(
    TimeUtils.defaultHours()
  );

  const school = SchoolStore.get(props.grade.schoolId as number);
  const schoolHours = school.hours as HoursType;

  const initalGradeHours = props.grade.hours;
  setLocalHours(initalGradeHours ? initalGradeHours : schoolHours);

  const [useSchoolSchedule, setUseSchoolSchedule] = createSignal<boolean>(
    initalGradeHours?.id ? schoolHours?.id == initalGradeHours?.id : true
  );

  createEffect(
    on(useSchoolSchedule, () => {
      if (useSchoolSchedule()) {
        setLocalHours(schoolHours);
      } else {
        if (initalGradeHours?.id == schoolHours.id) {
          setLocalHours({ ...(schoolHours as HoursType), id: 0 });
        } else {
          setLocalHours({ ...(initalGradeHours as HoursType) });
        }
      }
    })
  );

  createEffect(() => {
    props.onUpdate(localHours());
  });

  function onInputComingStart(value: string) {
    setLocalHours((prev) => {
      return {
        ...prev,
        startHourComing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputComingEnd(value: string) {
    setLocalHours((prev) => {
      return {
        ...prev,
        endHourComing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputGoingStart(value: string) {
    setLocalHours((prev) => {
      return {
        ...prev,
        startHourGoing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputGoingEnd(value: string) {
    setLocalHours((prev) => {
      return {
        ...prev,
        endHourGoing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onUpdateHourRules(rules: HourRuleType[]) {
    setLocalHours((prev) => {
      return {
        ...prev,
        rules: rules,
      };
    });
  }

  function usedCalendar(): CalendarType {
    return props.grade.calendar
      ? props.grade.calendar
      : (school.calendar as CalendarType);
  }

  function onChangeUseSchoolSchedule() {
    setUseSchoolSchedule((prev) => !prev);
  }

  return (
    <div>
      <div class="text-xl">Tranches horaires:</div>
      <LabeledCheckbox
        label="Utiliser les horaires de l'école"
        checked={useSchoolSchedule()}
        onChange={onChangeUseSchoolSchedule}
      />
      <TimesInputWrapper
        label="Aller"
        startValue={localHours().startHourComing}
        endValue={localHours().endHourComing}
        onInputStart={onInputComingStart}
        onInputEnd={onInputComingEnd}
        disabled={useSchoolSchedule()}
      />
      <TimesInputWrapper
        label="Retour"
        startValue={localHours().startHourGoing}
        endValue={localHours().endHourGoing}
        onInputStart={onInputGoingStart}
        onInputEnd={onInputGoingEnd}
        disabled={useSchoolSchedule()}
      />
      <GradeHourRuleList
        rules={props.grade.hours.rules}
        calendar={usedCalendar()}
        onUpdate={onUpdateHourRules}
        enabled={!useSchoolSchedule()}
      />
    </div>
  );
}
