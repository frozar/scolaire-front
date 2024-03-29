import { createEffect, createSignal } from "solid-js";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { calendars } from "../../../../../_stores/calendar.store";
import { SchoolStore } from "../../../../../_stores/school.store";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";

export function GradeCalendarSelectionWrapper(props: {
  grade: GradeType;
  onUpdate: (calendar: CalendarType) => void;
}) {
  const school = SchoolStore.get(props.grade.schoolId as number);

  const schoolCalendar = school.calendar as CalendarType;

  const initialGradeCalendar = props.grade.calendar;

  const [localCalendar, setLocalCalendar] = createSignal<CalendarType>(
    initialGradeCalendar ? initialGradeCalendar : schoolCalendar
  );

  const [useSchoolCalendar, setUseSchoolCalendar] = createSignal<boolean>(
    initialGradeCalendar != undefined
      ? schoolCalendar?.id == initialGradeCalendar?.id
      : true
  );

  createEffect(() => {
    props.onUpdate(localCalendar() as CalendarType);
  });

  function onChangeUseSchoolCalendar() {
    setUseSchoolCalendar((prev) => {
      const output = !prev;
      if (output) {
        setLocalCalendar(schoolCalendar);
      }
      return output;
    });
  }

  function onChangeSelectCalendar(value: string | number) {
    const calendar = calendars().find((item) => item.id == value);
    if (calendar) {
      setLocalCalendar(calendar);
    }
  }

  return (
    <>
      <div class="text-xl my-2">Calendrier:</div>
      <LabeledCheckbox
        label="Utiliser le calendrier de l'école"
        checked={useSchoolCalendar()}
        onChange={onChangeUseSchoolCalendar}
      />

      <SelectInput
        options={calendars().map((item) => {
          return { value: item.id, text: item.name };
        })}
        onChange={onChangeSelectCalendar}
        defaultValue={localCalendar()?.id ?? -1}
        // TODO FDEFAULT OPTION ???
        defaultOptions="Calendrier"
        disabled={useSchoolCalendar()}
      />
    </>
  );
}
