import { createEffect, createSignal, on, onMount } from "solid-js";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import { calendars } from "../../../calendar/template/Calendar";
import { selectedGrade, setSelectedGrade } from "./GradeBoard";
import { schoolDetailsItem } from "./SchoolDetails";

export const [bufferCalendar, setBufferCalendar] = createSignal<CalendarType>();

export function GradeCalendarSelectionWrapper() {
  const schoolCalendar = schoolDetailsItem()?.calendar;
  const initialCalendar = selectedGrade()?.calendar;
  const gradeCalendar = () => selectedGrade()?.calendar;

  const [useSchoolCalendar, setUseSchoolCalendar] = createSignal<boolean>(
    schoolCalendar?.id == gradeCalendar()?.id
  );

  createEffect(
    on(bufferCalendar, () => {
      // eslint-disable-next-line solid/reactivity
      setSelectedGrade((prev) => {
        if (!prev) return prev;
        return { ...prev, calendar: bufferCalendar() };
      });
    })
  );

  createEffect(
    on(useSchoolCalendar, () => {
      if (useSchoolCalendar()) setBufferCalendar(schoolCalendar);
      else setBufferCalendar(initialCalendar);
    })
  );

  onMount(() => {
    if (!initialCalendar || initialCalendar.id == schoolCalendar?.id) {
      setUseSchoolCalendar(true);
    } else setUseSchoolCalendar(false);
  });

  const selectOptions = calendars().map((item) => {
    return { text: item.name, value: item.id };
  });

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
        options={selectOptions}
        onChange={onChangeSelectCalendar}
        defaultValue={bufferCalendar()?.id}
        defaultOptions="Calendrier"
        disabled={useSchoolCalendar()}
      />
    </>
  );
}
