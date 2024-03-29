import { JSXElement, createEffect, createSignal, on, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { GradeEntity, GradeType } from "../../../../../_entities/grade.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { SchoolStore } from "../../../../../_stores/school.store";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import {
  schoolGradeEdit,
  setSchoolGradeEdit,
} from "../template/SchoolGradeEdit";
import { GradeHourRuleList } from "./GradeHourRuleList";

export function GradeTimesScheduleWrapper(props: {
  grade: GradeType;
  onUpdate: (hours: HoursType) => void;
}): JSXElement {
  const [bufferHours, setBufferHours] = createSignal<HoursType>(
    TimeUtils.defaultHours()
  );
  const [useSchoolSchedule, setUseSchoolSchedule] = createSignal<boolean>(true);

  const school = SchoolStore.get(props.grade.schoolId as number);
  const schoolHours = school.hours as HoursType;
  const initalGradeHours = props.grade.hours ?? TimeUtils.defaultHours();

  onMount(() => {
    // * if no hour for the grade set hours of school to grade
    // * else use grade hours
    if (initalGradeHours?.id == 0) setUseSchoolSchedule(true);
    else setUseSchoolSchedule(schoolHours?.id == initalGradeHours?.id);
  });

  createEffect(
    on(useSchoolSchedule, () => {
      if (useSchoolSchedule()) {
        setBufferHours(schoolHours);
      } else {
        if (initalGradeHours?.id == schoolHours.id) {
          setBufferHours({ ...(schoolHours as HoursType), id: 0 });
        } else {
          setBufferHours({ ...(initalGradeHours as HoursType) });
        }
      }
    })
  );

  createEffect(() => {
    if (bufferHours() != initalGradeHours) {
      props.onUpdate(bufferHours());
    }
  });

  function onInputComingStart(value: string) {
    setBufferHours((prev) => {
      return {
        ...prev,
        startHourComing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputComingEnd(value: string) {
    setBufferHours((prev) => {
      return {
        ...prev,
        endHourComing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputGoingStart(value: string) {
    setBufferHours((prev) => {
      return {
        ...prev,
        startHourGoing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputGoingEnd(value: string) {
    setBufferHours((prev) => {
      return {
        ...prev,
        endHourGoing: GradeEntity.getHourFormatFromString(value),
      };
    });
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
        startValue={bufferHours().startHourComing}
        endValue={bufferHours().endHourComing}
        onInputStart={onInputComingStart}
        onInputEnd={onInputComingEnd}
        disabled={useSchoolSchedule()}
      />
      <TimesInputWrapper
        label="Retour"
        startValue={bufferHours().startHourGoing}
        endValue={bufferHours().endHourGoing}
        onInputStart={onInputGoingStart}
        onInputEnd={onInputGoingEnd}
        disabled={useSchoolSchedule()}
      />
      <GradeHourRuleList
        item={schoolGradeEdit}
        setItem={setSchoolGradeEdit}
        enabled={!useSchoolSchedule()}
      />
    </div>
  );
}
