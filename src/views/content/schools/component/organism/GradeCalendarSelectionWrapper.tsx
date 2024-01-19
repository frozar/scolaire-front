import { createEffect, createSignal, on } from "solid-js";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { calendars } from "../../../calendar/template/Calendar";
import { selectedGrade } from "./GradeBoard";
import { schoolDetailsItem } from "./SchoolDetails";

export const [bufferCalendar, setBufferCalendar] = createSignal<CalendarType>();

export function GradeCalendarSelectionWrapper() {
  const schoolCalendar = SchoolUtils.get(schoolDetailsItem()?.id as number)
    .calendar as CalendarType;

  const initialGradeCalendar = selectedGrade()?.calendar;

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
      if (useSchoolCalendar()) setBufferCalendar(schoolCalendar);
      else setBufferCalendar(calendarFiltered[0]);
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
      <LabeledCheckbox
        label="Utiliser le calendrier de l'école"
        checked={useSchoolCalendar()}
        onChange={onChangeUseSchoolCalendar}
      />

      <SelectInput
        options={selectOptions()}
        onChange={onChangeSelectCalendar}
        defaultValue={bufferCalendar()?.id}
        defaultOptions="Calendrier"
        disabled={useSchoolCalendar()}
      />
    </>
  );
}
