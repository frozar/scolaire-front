import { createSignal, onCleanup, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import {
  GradeEntity,
  GradeType,
  HourFormat,
} from "../../../../../_entities/grade.entity";
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
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailsItem, setSchoolDetailsItem } from "./SchoolDetails";

export const [selectedGrade, setSelectedGrade] = createSignal<GradeType>();

// TODO Refactor
// eslint-disable-next-line solid/reactivity
export default function () {
  const [gradeName, setGradeName] = createSignal(selectedGrade()?.name);

  const [morningStart, setMorningStart] = createSignal<HourFormat>();
  const [morningEnd, setMorningEnd] = createSignal<HourFormat>();
  const [afternoonStart, setAfternoonStart] = createSignal<HourFormat>();
  const [afternoonEnd, setAfternoonEnd] = createSignal<HourFormat>();

  onMount(() => {
    setMorningStart(selectedGrade()?.hours.startHourComing);
    setMorningEnd(selectedGrade()?.hours.endHourComing);
    setAfternoonEnd(selectedGrade()?.hours.endHourGoing);
    setAfternoonStart(selectedGrade()?.hours.startHourGoing);
  });

  function getHours(): HoursType {
    return {
      id: selectedGrade()?.hours.id ?? 0,
      startHourComing: morningStart() as HourFormat,
      endHourComing: morningEnd() as HourFormat,
      startHourGoing: afternoonStart() as HourFormat,
      endHourGoing: afternoonEnd() as HourFormat,
    };
  }

  async function nextStep() {
    let grade: GradeType;
    const schoolToUpdate = schoolDetailsItem() as SchoolType;
    if (!schoolDetailsItem()?.id) return;

    if (onBoard() == "school-grade-add") {
      grade = await GradeService.create({
        schoolId: schoolDetailsItem()?.id as number,
        name: gradeName() ?? "",
        hours: getHours(),
      });
      schoolToUpdate?.grades.push(grade);
    } else {
      grade = await GradeService.update({
        ...selectedGrade(),
        name: gradeName() ?? "",
        hours: getHours(),
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

  function onInputComingStart(value: string) {
    setMorningStart(GradeEntity.getHourFormatFromString(value));
  }

  function onInputComingEnd(value: string) {
    setMorningEnd(GradeEntity.getHourFormatFromString(value));
  }

  function onInputGoingStart(value: string) {
    setAfternoonStart(GradeEntity.getHourFormatFromString(value));
  }

  function onInputGoingEnd(value: string) {
    setAfternoonEnd(GradeEntity.getHourFormatFromString(value));
  }

  onCleanup(() => setSelectedGrade());

  // TODO add checkbox to define if we use school schedule or not to define  grade schedule
  return (
    <section>
      <GradeBoardHeader
        title={
          onBoard() == "school-grade-add"
            ? "Ajout d'une grade"
            : "Modifier une grade"
        }
      />

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
          placeholder="Nom de la grade"
        />

        <TimesInputWrapper
          label="Horaires matin"
          startValue={GradeEntity.getStringFromHourFormat(morningStart())}
          endValue={GradeEntity.getStringFromHourFormat(morningEnd())}
          onInputStart={onInputComingStart}
          onInputEnd={onInputComingEnd}
        />
        <TimesInputWrapper
          label="Horaires après-midi"
          startValue={GradeEntity.getStringFromHourFormat(afternoonStart())}
          endValue={GradeEntity.getStringFromHourFormat(afternoonEnd())}
          onInputStart={onInputGoingStart}
          onInputEnd={onInputGoingEnd}
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
