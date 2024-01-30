import { Show, createSignal, onCleanup } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { GradeService } from "../../../../../_services/grade.service";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import {
  getSchools,
  setSchools,
} from "../../../map/component/organism/SchoolPoints";
import GradeBoardHeader from "../molecule/GradeBoardHeader";
import {
  GradeCalendarSelectionWrapper,
  bufferCalendar,
} from "./GradeCalendarSelectionWrapper";
import {
  GradeTimesScheduleWrapper,
  bufferHours,
  useSchoolSchedule,
} from "./GradeTimesScheduleWrapper";
import { HourRuleList } from "./HourRuleList";
import { schoolDetailsItem } from "./SchoolDetails";

export const [selectedGrade, setSelectedGrade] = createSignal<GradeType>();

// TODO Refactor
// eslint-disable-next-line solid/reactivity
export function GradeEditBoard() {
  const [gradeName, setGradeName] = createSignal(selectedGrade()?.name);

  async function nextStep() {
    let grade: GradeType;
    // TODO: Do not use schoolDetailsItem() It must be used only as a buffer value
    // of a school being modified
    const schoolToUpdate = schoolDetailsItem() as SchoolType;
    if (!schoolDetailsItem()?.id) return;

    if (onBoard() == "school-grade-add") {
      grade = await GradeService.create({
        schoolId: schoolDetailsItem()?.id as number,
        name: gradeName() ?? "",
        hours: bufferHours(),
        calendar: bufferCalendar(),
      });
      schoolToUpdate?.grades.push(grade);
    } else {
      grade = await GradeService.update({
        ...selectedGrade(),
        name: gradeName() ?? "",
        hours: bufferHours(),
        calendar: bufferCalendar(),
      });

      const gradeIndex = schoolToUpdate.grades.findIndex(
        (item) => item.id == grade.id
      );
      schoolToUpdate.grades[gradeIndex] = grade;
    }

    const schoolIndex = getSchools().findIndex(
      (item) => item.id == schoolDetailsItem()?.id
    );

    setSchools((prev) => {
      if (!prev) return prev;
      const schools = [...prev];
      schools[schoolIndex] = schoolToUpdate;

      return schools;
    });

    if (onBoard() == "school-grade-add") changeBoard("school-details");
    else changeBoard("school-grade-details");
  }

  function onClickCancel() {
    changeBoard("school-grade-details");
  }

  const title =
    onBoard() == "school-grade-add"
      ? "Ajout d'une classe"
      : "Modifier une classe";

  onCleanup(() => {
    if (onBoard() != "school-grade-details") setSelectedGrade();
  });

  return (
    <section>
      <GradeBoardHeader title={title} />

      <div class="content">
        <LabeledInputField
          name="grade-name"
          onInput={(event) => setGradeName(event.target.value)}
          value={gradeName() ?? ""}
          label="Nom de la classe"
          placeholder="Nom de la classe"
        />
        <GradeCalendarSelectionWrapper />
        {/* TODO: Delete this */}
        <div class="my-4" />
        <Show when={bufferCalendar() != undefined}>
          <GradeTimesScheduleWrapper />
        </Show>
        <HourRuleList
          item={selectedGrade}
          setItem={setSelectedGrade}
          enabled={!useSchoolSchedule()}
        />
      </div>

      <BoardFooterActions
        nextStep={{
          callback: nextStep,
          label: "Valider",
        }}
        previousStep={{
          callback: onClickCancel,
          label: "Annuler",
        }}
      />
    </section>
  );
}