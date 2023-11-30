import { createSignal, onCleanup } from "solid-js";
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
import GradeLinkedSchool from "../atom/GradeLinkedSchool";
import GradeBoardHeader from "../molecule/GradeBoardHeader";
import {
  GradeCalendarSelectionWrapper,
  bufferCalendar,
} from "./GradeCalendarSelectionWrapper";
import {
  GradeTimesScheduleWrapper,
  bufferHours,
} from "./GradeTimesScheduleWrapper";
import { schoolDetailsItem, setSchoolDetailsItem } from "./SchoolDetails";

export const [selectedGrade, setSelectedGrade] = createSignal<GradeType>();

// TODO Refactor
// eslint-disable-next-line solid/reactivity
export default function () {
  const [gradeName, setGradeName] = createSignal(selectedGrade()?.name);

  async function nextStep() {
    let grade: GradeType;
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

    setSchoolDetailsItem(schoolToUpdate);
    changeBoard("school-details");
  }

  function onClickCancel() {
    changeBoard("school-details");
  }

  const title =
    onBoard() == "school-grade-add"
      ? "Ajout d'une grade"
      : "Modifier une grade";

  onCleanup(() => setSelectedGrade());

  return (
    <section>
      <GradeBoardHeader title={title} />

      <div class="content">
        <div class="line-height-1">
          <p>Ecole:</p>
          <GradeLinkedSchool schools={[schoolDetailsItem()?.name as string]} />
        </div>
        <LabeledInputField
          name="grade-name"
          onInput={(event) => setGradeName(event.target.value)}
          value={gradeName() ?? ""}
          label="Nom de la grade"
          placeholder="Nom de la classe"
        />

        <GradeCalendarSelectionWrapper />
        <div class="my-4" />
        <GradeTimesScheduleWrapper />
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
