import { JSXElement, createEffect, createSignal, on, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { selectedGrade, setSelectedGrade } from "./GradeBoard";
import { schoolDetailsItem } from "./SchoolDetails";

export const [bufferHours, setBufferHours] = createSignal<HoursType>(
  TimeUtils.defaultHours()
);

export function GradeTimesScheduleWrapper(): JSXElement {
  const schoolHours = schoolDetailsItem()?.hours as HoursType;
  const initalGradeHours = selectedGrade()?.hours;
  const [useSchoolSchedule, setUseSchoolSchedule] = createSignal<boolean>(
    schoolHours?.id == initalGradeHours?.id
  );

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
      // eslint-disable-next-line solid/reactivity
      setSelectedGrade((prev) => {
        if (!prev) return prev;
        return { ...prev, hours: bufferHours() };
      });
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
      <LabeledCheckbox
        label="Utilisé les horaires école"
        checked={useSchoolSchedule()}
        onChange={onChangeUseSchoolSchedule}
      />
      <TimesInputWrapper
        label="Horaires matin"
        startValue={GradeEntity.getStringFromHourFormat(
          bufferHours().startHourComing
        )}
        endValue={GradeEntity.getStringFromHourFormat(
          bufferHours().endHourComing
        )}
        onInputStart={onInputComingStart}
        onInputEnd={onInputComingEnd}
        disabled={useSchoolSchedule()}
      />
      <TimesInputWrapper
        label="Horaires après-midi"
        startValue={GradeEntity.getStringFromHourFormat(
          bufferHours().startHourGoing
        )}
        endValue={GradeEntity.getStringFromHourFormat(
          bufferHours().endHourGoing
        )}
        onInputStart={onInputGoingStart}
        onInputEnd={onInputGoingEnd}
        disabled={useSchoolSchedule()}
      />
    </div>
  );
}