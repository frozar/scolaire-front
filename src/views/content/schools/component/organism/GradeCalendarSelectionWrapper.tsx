import { createEffect, createSignal, on } from "solid-js";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolStore } from "../../../../../_stores/school.store";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { calendars } from "../../../calendar/calendar.manager";

export function GradeCalendarSelectionWrapper(props: {
  grade: GradeType;
  onUpdate: (calendar: CalendarType) => void;
}) {
  const [bufferCalendar, setBufferCalendar] = createSignal<CalendarType>();

  const school = SchoolStore.get(props.grade.schoolId as number);

  const schoolCalendar = SchoolUtils.get(school.id as number)
    .calendar as CalendarType;

  const initialGradeCalendar = props.grade.calendar as CalendarType;

  setBufferCalendar(initialGradeCalendar);

  const [useSchoolCalendar, setUseSchoolCalendar] = createSignal<boolean>(
    initialGradeCalendar != undefined
      ? schoolCalendar?.id == initialGradeCalendar?.id
      : false
  );

  const calendarFiltered = calendars().filter(
    (calendar) => calendar.id != schoolCalendar?.id
  );

  createEffect(
    on(useSchoolCalendar, () => {
      if (useSchoolCalendar()) props.onUpdate(schoolCalendar);
      else props.onUpdate(calendarFiltered[0]);
    })
  );

  function selectOptions() {
    return useSchoolCalendar()
      ? calendars().map((item) => {
          return { text: item.name, value: item.id };
        })
      : calendarFiltered.map((item) => {
          return { text: item.name, value: item.id };
        });
  }

  function onChangeUseSchoolCalendar() {
    setUseSchoolCalendar((prev) => !prev);
  }

  function onChangeSelectCalendar(value: string | number) {
    const calendar = calendars().find((item) => item.id == value);
    setBufferCalendar(calendar);
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
        options={selectOptions()}
        onChange={onChangeSelectCalendar}
        defaultValue={bufferCalendar()?.id ?? -1}
        defaultOptions="Calendrier"
        disabled={useSchoolCalendar()}
      />
    </>
  );
}
