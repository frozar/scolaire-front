import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import {
  GradeEntity,
  GradeType,
  HourFormat,
} from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { GradeService } from "../../../../../_services/grade.service";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
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
  const [useSchoolSchedule, setUseSchoolSchedule] = createSignal<boolean>(true);
  const [gradeName, setGradeName] = createSignal(selectedGrade()?.name);

  const [morningStart, setMorningStart] = createSignal<HourFormat>();
  const [morningEnd, setMorningEnd] = createSignal<HourFormat>();
  const [afternoonStart, setAfternoonStart] = createSignal<HourFormat>();
  const [afternoonEnd, setAfternoonEnd] = createSignal<HourFormat>();

  createEffect(() => {
    if (useSchoolSchedule()) setHours(schoolDetailsItem()?.hours);
    else setHours(selectedGrade()?.hours);
  });

  onMount(() => {
    if (selectedGrade()?.hours.id == schoolDetailsItem()?.hours.id)
      setUseSchoolSchedule(true);
    else setUseSchoolSchedule(false);

    setHours(selectedGrade()?.hours);
  });

  function getHours(): HoursType {
    const id = useSchoolSchedule() ? schoolDetailsItem()?.hours.id : 0;
    return {
      id: id as number,
      startHourComing: morningStart() as HourFormat,
      endHourComing: morningEnd() as HourFormat,
      startHourGoing: afternoonStart() as HourFormat,
      endHourGoing: afternoonEnd() as HourFormat,
    };
  }

  function setHours(hours?: HoursType) {
    setMorningStart(hours?.startHourComing);
    setMorningEnd(hours?.endHourComing);
    setAfternoonEnd(hours?.endHourGoing);
    setAfternoonStart(hours?.startHourGoing);
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

  function onChangeUseSchoolSchedule() {
    setUseSchoolSchedule((prev) => !prev);
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
          placeholder="Nom de la grade"
        />

        <LabeledCheckbox
          label="Horaires école"
          checked={useSchoolSchedule()}
          onChange={onChangeUseSchoolSchedule}
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
