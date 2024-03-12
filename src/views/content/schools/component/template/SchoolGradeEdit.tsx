import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { GradeService } from "../../../../../_services/grade.service";
import {
  SchoolStore,
  getSchools,
  setSchools,
} from "../../../../../_stores/school.store";
import { ViewManager } from "../../../ViewManager";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { onBoard } from "../../../board/component/template/ContextManager";
import GradeBoardHeader from "../molecule/GradeBoardHeader";
import { GradeCalendarSelectionWrapper } from "../organism/GradeCalendarSelectionWrapper";
import { GradeTimesScheduleWrapper } from "../organism/GradeTimesScheduleWrapper";
import { setMapDataGradeDetail } from "./SchoolGradeDetails";

export const [schoolGradeEdit, setSchoolGradeEdit] = createSignal<GradeType>();

// TODO Refactor
// eslint-disable-next-line solid/reactivity
export function SchoolGradeEdit() {
  const [localGrade, setLocalGrade] = createSignal<GradeType>();
  setLocalGrade(schoolGradeEdit() as GradeType);

  const [gradeName, setGradeName] = createSignal(localGrade()?.name);

  onMount(() => {
    setMapDataGradeDetail(localGrade());
  });

  onCleanup(() => {
    setLocalGrade();
    setMapDataGradeDetail(localGrade());
  });

  function updateCalendar(calendar: CalendarType) {
    setLocalGrade((grade) => {
      if (grade) return { ...grade, calendar: calendar };
      else return undefined;
    });
  }

  function updateHours(hours: HoursType) {
    setLocalGrade((grade) => {
      if (grade) return { ...grade, hours: hours };
      else return undefined;
    });
  }

  function onClickCancel() {
    ViewManager.schoolGrade(schoolGradeEdit() as GradeType);
  }
  //TODO revoir tout le code du register -> surtout partie Service + "store"
  async function register() {
    const initialGrade = schoolGradeEdit() as GradeType;
    const schoolToUpdate = SchoolStore.get(initialGrade.schoolId as number);
    if (!schoolToUpdate) return;

    const grade = await GradeService.update(localGrade() as GradeType);

    const gradeIndex = schoolToUpdate.grades.findIndex(
      (item) => item.id == grade.schoolId
    );
    schoolToUpdate.grades[gradeIndex] = grade;

    const schoolIndex = getSchools().findIndex(
      (item) => item.id == grade.schoolId
    );

    setSchools((prev) => {
      if (!prev) return prev;
      const schools = [...prev];
      schools[schoolIndex] = schoolToUpdate;

      return schools;
    });

    ViewManager.schoolGrade(grade);
  }

  const title =
    onBoard() == "school-grade-add"
      ? "Ajout d'une classe"
      : "Modifier une classe";

  return (
    <section>
      <Show when={schoolGradeEdit()}>
        <GradeBoardHeader title={title} />

        <div class="content">
          <LabeledInputField
            name="grade-name"
            onInput={(event) => setGradeName(event.target.value)}
            value={gradeName() ?? ""}
            label="Nom de la classe"
            placeholder="Nom de la classe"
          />

          <GradeCalendarSelectionWrapper
            grade={schoolGradeEdit() as GradeType}
            onUpdate={updateCalendar}
          />

          <Show when={schoolGradeEdit()?.calendar}>
            <GradeTimesScheduleWrapper
              grade={schoolGradeEdit() as GradeType}
              onUpdate={updateHours}
            />
          </Show>
        </div>

        <BoardFooterActions
          nextStep={{
            callback: register,
            label: "Valider",
          }}
          previousStep={{
            callback: onClickCancel,
            label: "Annuler",
          }}
        />
      </Show>
    </section>
  );
}
