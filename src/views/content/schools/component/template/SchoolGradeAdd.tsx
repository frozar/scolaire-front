import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeEntity, GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { GradeService } from "../../../../../_services/grade.service";
import { SchoolStore } from "../../../../../_stores/school.store";
import { ViewManager } from "../../../ViewManager";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { onBoard } from "../../../board/component/template/ContextManager";
import GradeBoardHeader from "../molecule/GradeBoardHeader";
import { GradeCalendarSelectionWrapper } from "../organism/GradeCalendarSelectionWrapper";
import { GradeTimesScheduleWrapper } from "../organism/GradeTimesScheduleWrapper";

export const [schoolOfAddGrade, setSchoolOfAddGrade] =
  createSignal<SchoolType>();

export function SchoolGradeAdd() {
  const school: SchoolType = schoolOfAddGrade() as SchoolType;
  console.log("toto");

  const [localGrade, setLocalGrade] = createSignal<GradeType>();
  setLocalGrade(GradeEntity.initEntity(school));

  const [gradeName, setGradeName] = createSignal(localGrade()?.name);

  onMount(() => {
    setMapData(localGrade());
  });

  onCleanup(() => {
    setLocalGrade();
    setMapData(localGrade());
  });

  function updateName(name: string) {
    setGradeName(name);
    setLocalGrade((grade) => {
      if (grade) return { ...grade, name: name };
      else return undefined;
    });
  }

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
    ViewManager.schoolDetails(schoolOfAddGrade() as SchoolType);
  }
  //TODO revoir tout le code du register -> surtout partie Service + "store"
  async function register() {
    const schoolToUpdate = SchoolStore.get(localGrade()?.schoolId as number);
    if (!schoolToUpdate) return;
    const grade = await GradeService.create(localGrade() as GradeType);
    SchoolStore.addGrade(grade);
    ViewManager.schoolGrade(grade);
  }

  const title =
    onBoard() == "school-grade-add"
      ? "Ajout d'une classe"
      : "Modifier une classe";

  return (
    <section>
      <Show when={localGrade()}>
        <GradeBoardHeader title={title} />

        <div class="content">
          <LabeledInputField
            name="grade-name"
            onInput={(event) => updateName(event.target.value)}
            value={gradeName() ?? ""}
            label="Nom de la classe"
            placeholder="Nom de la classe"
          />

          <GradeCalendarSelectionWrapper
            grade={localGrade() as GradeType}
            onUpdate={updateCalendar}
          />

          <Show when={localGrade()?.calendar}>
            <GradeTimesScheduleWrapper
              grade={localGrade() as GradeType}
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

function setMapData(grade: GradeType | undefined) {
  if (grade && grade.schoolId) {
    const school: SchoolType = SchoolStore.get(grade.schoolId);
    setDisplaySchools([school]);
  } else {
    setDisplaySchools([]);
    // setDisplayTrips([]);
  }
}
