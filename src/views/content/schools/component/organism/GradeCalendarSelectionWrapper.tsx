import { createEffect, createSignal, on, onMount } from "solid-js";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { calendars } from "../../../calendar/template/Calendar";
import { selectedGrade, setSelectedGrade } from "./GradeBoard";

export const [bufferCalendar, setBufferCalendar] = createSignal<CalendarType>();

// TODO: Fix: quand schoolCalendar == initialCalendar => c'est le calendrier de l'école qui est utilisé
export function GradeCalendarSelectionWrapper() {
  const schoolCalendar = SchoolUtils.getFromGradeId(
    selectedGrade()?.id as number
  ).calendar;

  // TODO: Rename
  const initialCalendar = selectedGrade()?.calendar;
  const gradeCalendar = () => selectedGrade()?.calendar;
  // console.log("schoolCalendar", schoolCalendar);
  // console.log("initialCalendar", initialCalendar);
  // ! Une grade déjà crée est sytematiquement lié à un calendar ?
  setBufferCalendar(initialCalendar);
  console.log("schoolCalendar?.id", schoolCalendar?.id);
  console.log("gradeCalendar()?.id", gradeCalendar()?.id);

  const [useSchoolCalendar, setUseSchoolCalendar] = createSignal<boolean>(
    schoolCalendar?.id == gradeCalendar()?.id
  );
  // ! Useless because GradeBoard.tsx use bufferCalendar() as calendar value ?!!!!!!!
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
      console.log("createEffect =>");
      console.log("schoolCalendar", schoolCalendar);
      console.log("initialCalendar", initialCalendar);

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
  console.log("bufferCalendar()?.id", bufferCalendar()?.id);

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
