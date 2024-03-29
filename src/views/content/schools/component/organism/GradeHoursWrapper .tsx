import { JSXElement, createEffect, createSignal, on } from "solid-js";
import {
  HourRuleType,
  HoursType,
} from "../../../../../_entities/_utils.entity";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeEntity, GradeType } from "../../../../../_entities/grade.entity";
import { SchoolStore } from "../../../../../_stores/school.store";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { GradeHourRuleList } from "./GradeHourRuleList";

export function GradeHoursWrapper(props: {
  grade: GradeType;
  calendar: CalendarType;
  onUpdate: (hours: HoursType) => void;
}): JSXElement {
  const school = SchoolStore.get(props.grade.schoolId as number);
  const schoolHours = school.hours;

  const initalGradeHours = props.grade.hours;

  const [localHours, setLocalHours] = createSignal<HoursType>(
    props.grade.hours
  );

  const [useSchoolSchedule, setUseSchoolSchedule] = createSignal<boolean>(
    schoolHours.id == localHours().id
  );
  const [disableUseSchoolCheckbox, setDisableUseSchoolCheckbox] =
    createSignal<boolean>(false);

  createEffect(() => {
    setLocalHours(props.grade.hours);
  });

  createEffect(() => {
    setUseSchoolSchedule(props.calendar?.id == school.calendar?.id);
    setDisableUseSchoolCheckbox(props.calendar?.id != school.calendar?.id);
  });

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
        rules: [...rules],
      };
    });
  }

  function onChangeUseSchoolSchedule() {
    setUseSchoolSchedule((prev) => {
      return !prev;
    });
  }

  createEffect(
    on(useSchoolSchedule, () => {
      if (useSchoolSchedule()) {
        setLocalHours(schoolHours);
      } else {
        if (initalGradeHours?.id == schoolHours.id) {
          setLocalHours((prev) => {
            return { ...prev, id: 0 };
          });
        } else {
          setLocalHours({ ...(initalGradeHours as HoursType) });
        }
      }
    })
  );

  return (
    <div>
      <div class="text-xl">Tranches horaires:</div>
      <LabeledCheckbox
        label="Utiliser les horaires de l'école"
        checked={useSchoolSchedule()}
        onChange={onChangeUseSchoolSchedule}
        disabled={disableUseSchoolCheckbox()}
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
        rules={localHours().rules}
        calendar={props.calendar}
        onUpdate={onUpdateHourRules}
        enabled={!useSchoolSchedule()}
      />
    </div>
  );
}
