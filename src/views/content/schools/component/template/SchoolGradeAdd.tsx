import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { EntityUtils, HoursType } from "../../../../../_entities/_utils.entity";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeEntity, GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { TimeUtils } from "../../../../../_entities/time.utils";
import { GradeService } from "../../../../../_services/grade.service";
import { SchoolStore } from "../../../../../_stores/school.store";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { ViewManager } from "../../../ViewManager";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import GradeBoardHeader from "../molecule/GradeBoardHeader";
import { GradeCalendarSelectionWrapper } from "../organism/GradeCalendarSelectionWrapper";
import { GradeHoursWrapper } from "../organism/GradeHoursWrapper ";

export const [schoolOfAddGrade, setSchoolOfAddGrade] =
  createSignal<SchoolType>();

export function SchoolGradeAdd() {
  const school = schoolOfAddGrade() as SchoolType;

  const [localGrade, setLocalGrade] = createSignal<GradeType>(
    GradeEntity.initFromSchool(school)
  );

  const [localCalendar, setLocalCalendar] = createSignal<CalendarType>(
    // eslint-disable-next-line solid/reactivity
    localGrade().calendar as CalendarType
  );

  // eslint-disable-next-line solid/reactivity
  const [gradeName, setGradeName] = createSignal(localGrade()?.name);

  onMount(() => {
    setLocalGrade(GradeEntity.initFromSchool(school));
    setDisplaySchools([school]);
  });

  onCleanup(() => {
    setDisplaySchools([]);
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
      const hours =
        calendar.id == school.calendar?.id
          ? school.hours
          : EntityUtils.defaultHours();
      return {
        ...grade,
        calendar: calendar,
        hours: hours,
      };
    });
  }

  function updateHours(hours: HoursType) {
    setLocalGrade((grade) => {
      return { ...grade, hours: hours };
    });
  }

  function onClickCancel() {
    ViewManager.schoolDetails(school);
  }

  async function register() {
    const locGrade = localGrade();
    const school = schoolOfAddGrade();
    if (locGrade && school) {
      // TODO push dans le service.create ??
      locGrade.calendar = computedCalendar(locGrade, school);
      locGrade.hours = computedHours(locGrade, school);

      enableSpinningWheel();
      //TODO revoir le code partie -> Service + "store"
      const grade = await GradeService.create(locGrade);
      disableSpinningWheel();
      addNewGlobalSuccessInformation(grade.name + " créé");
      SchoolStore.addGrade(grade);
      ViewManager.schoolDetails(school);
      // ViewManager.schoolGrade(grade);
    }
    return;
  }

  return (
    <section>
      <Show when={localGrade()}>
        <GradeBoardHeader title="Ajout d'une classe" />

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

          <GradeHoursWrapper
            grade={localGrade() as GradeType}
            calendar={localCalendar()}
            onUpdate={updateHours}
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

function computedHours(grade: GradeType, school: SchoolType): HoursType {
  if (grade.hours.id != school.hours.id) {
    return grade.hours;
  }
  return TimeUtils.defaultHours();
}

function computedCalendar(
  grade: GradeType,
  school: SchoolType
): CalendarType | undefined {
  let output: CalendarType | undefined = undefined;
  if (grade.calendar && grade.calendar.id != school.calendar?.id) {
    output = grade.calendar;
  }
  return output;
}
