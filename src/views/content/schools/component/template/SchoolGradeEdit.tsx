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
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { ViewManager } from "../../../ViewManager";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { onBoard } from "../../../board/component/template/ContextManager";
import GradeBoardHeader from "../molecule/GradeBoardHeader";
import { GradeCalendarSelectionWrapper } from "../organism/GradeCalendarSelectionWrapper";
import { GradeHoursWrapper } from "../organism/GradeHoursWrapper ";
import { setMapDataGradeDetail } from "./SchoolGradeDetails";

export const [schoolGradeEdit, setSchoolGradeEdit] = createSignal<GradeType>();

export function SchoolGradeEdit() {
  const [localGrade, setLocalGrade] = createSignal<GradeType>(
    schoolGradeEdit() as GradeType
  );

  const [localCalendar, setLocalCalendar] = createSignal<CalendarType>(
    // eslint-disable-next-line solid/reactivity
    localGrade().calendar as CalendarType
  );

  // eslint-disable-next-line solid/reactivity
  const [gradeName, setGradeName] = createSignal(localGrade().name);

  onMount(() => {
    setLocalGrade(schoolGradeEdit() as GradeType);
    setMapDataGradeDetail(localGrade());
  });

  onCleanup(() => {
    setMapDataGradeDetail(localGrade());
  });

  function updateName(name: string) {
    setGradeName(name);
    setLocalGrade((grade) => {
      return { ...grade, name: name };
    });
  }

  function updateCalendar(calendar: CalendarType) {
    setLocalCalendar(calendar);
    setLocalGrade((grade) => {
      return { ...grade, calendar: calendar };
    });
  }

  function updateHours(hours: HoursType) {
    setLocalGrade((grade) => {
      return { ...grade, hours: hours };
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

    enableSpinningWheel();
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

    disableSpinningWheel();
    addNewGlobalSuccessInformation("Les modifications ont étés apportées");
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
            onInput={(event) => updateName(event.target.value)}
            value={(gradeName() as string) ?? ""}
            label="Nom de la classe"
            placeholder="Nom de la classe"
          />

          <GradeCalendarSelectionWrapper
            grade={localGrade()}
            onUpdate={updateCalendar}
          />

          <GradeHoursWrapper
            grade={localGrade()}
            onUpdate={updateHours}
            calendar={localCalendar()}
          />
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
