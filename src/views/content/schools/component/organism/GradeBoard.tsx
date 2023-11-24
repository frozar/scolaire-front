import { createSignal, onCleanup, onMount } from "solid-js";
import {
  GradeEntity,
  GradeType,
  HourFormat,
} from "../../../../../_entities/grade.entity";
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
import { schoolDetails, setSchoolDetailsItem } from "./SchoolDetails";

export const [selectedGrade, setSelectedGrade] = createSignal<GradeType>();

// TODO Refactor
// eslint-disable-next-line solid/reactivity
export default function () {
  const defaultTime = {
    hour: 0,
    minutes: 0,
  };

  let defaultGrade: GradeType;
  // Case adding a new grade
  if (onBoard() == "school-grade-add") {
    defaultGrade = {
      name: "Nom de grade par défaut",
      morningStart: defaultTime,
      morningEnd: defaultTime,
      afternoonStart: defaultTime,
      afternoonEnd: defaultTime,
    };
    // Case modifying an existing grade
  } else {
    const grade = selectedGrade() as GradeType;
    defaultGrade = {
      name: grade.name,
      morningStart: grade.morningStart,
      morningEnd: grade.morningEnd,
      afternoonStart: grade.afternoonStart,
      afternoonEnd: grade.afternoonEnd,
    };
  }

  const [gradeName, setGradeName] = createSignal(defaultGrade.name);

  const [morningStart, setMorningStart] = createSignal<HourFormat>();
  const [morningEnd, setMorningEnd] = createSignal<HourFormat>();
  const [afternoonStart, setAfternoonStart] = createSignal<HourFormat>();
  const [afternoonEnd, setAfternoonEnd] = createSignal<HourFormat>();

  onMount(() => {
    setMorningStart(defaultGrade.morningStart);
    setMorningEnd(defaultGrade.morningEnd);
    setAfternoonEnd(defaultGrade.afternoonEnd);
    setAfternoonStart(defaultGrade.afternoonStart);
  });

  function onInputGradeName(
    e: Event & {
      target: HTMLInputElement;
    }
  ) {
    setGradeName(e.target.value);
  }

  async function onClickAddGrade() {
    const schoolId = schoolDetails()?.id;
    if (!schoolId) return;

    // TODO: Verify if schedules input different of "0:0" then display user message and return;

    const newGrade = await GradeService.create({
      schoolId: schoolId,
      name: gradeName(),
      morningStart: morningStart() as HourFormat,
      morningEnd: morningEnd() as HourFormat,
      afternoonStart: afternoonStart() as HourFormat,
      afternoonEnd: afternoonEnd() as HourFormat,
    });

    setSchools((prev) => {
      const schoolToModify = prev.filter((school) => school.id == schoolId)[0];
      const newSchools = [...prev].filter((school) => school.id != schoolId);
      newSchools.push({
        ...schoolToModify,
        grades: [...schoolToModify.grades, newGrade],
      });
      return newSchools;
    });

    setSchoolDetailsItem(
      getSchools().filter((school) => school.id == schoolId)[0]
    );
    changeBoard("school-details");
  }

  async function onClickModifyGrade() {
    const schoolId = schoolDetails()?.id;
    if (!schoolId) return;

    const updatedGrade = await GradeService.update({
      ...selectedGrade(),
      name: gradeName(),
      morningStart: morningStart() as HourFormat,
      morningEnd: morningEnd() as HourFormat,
      afternoonStart: afternoonStart() as HourFormat,
      afternoonEnd: afternoonEnd() as HourFormat,
    });

    setSchools((prev) => {
      const schoolToModify = prev.filter((school) => school.id == schoolId)[0];
      const newSchools = [...prev].filter((school) => school.id != schoolId);

      newSchools.push({
        ...schoolToModify,
        grades: [
          ...schoolToModify.grades.filter(
            (grade) => grade.id != updatedGrade.id
          ),
          updatedGrade,
        ],
      });

      return newSchools;
    });

    setSchoolDetailsItem(
      getSchools().filter((school) => school.id == schoolId)[0]
    );
    changeBoard("school-details");
  }

  function onClickCancel() {
    changeBoard("school-details");
  }

  function onInputComingStart(value: string) {
    const formatedSchedule = GradeEntity.getHourFormatFromString(value);
    if (!formatedSchedule) return;
    setMorningStart(formatedSchedule);
  }

  function onInputComingEnd(value: string) {
    const formatedSchedule = GradeEntity.getHourFormatFromString(value);
    if (!formatedSchedule) return;
    setMorningEnd(formatedSchedule);
  }

  function onInputGoingStart(value: string) {
    const formatedSchedule = GradeEntity.getHourFormatFromString(value);
    if (!formatedSchedule) return;
    setMorningStart(formatedSchedule);
  }

  function onInputGoingEnd(value: string) {
    const formatedSchedule = GradeEntity.getHourFormatFromString(value);
    if (!formatedSchedule) return;
    setMorningEnd(formatedSchedule);
  }

  onCleanup(() => setSelectedGrade());

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
          <GradeLinkedSchool schools={[schoolDetails()?.name as string]} />
        </div>

        <LabeledInputField
          name="grade-name"
          onInput={onInputGradeName}
          value={gradeName()}
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
          startValue={GradeEntity.getStringFromHourFormat(setAfternoonStart())}
          endValue={GradeEntity.getStringFromHourFormat(setAfternoonEnd())}
          onInputStart={onInputGoingStart}
          onInputEnd={onInputGoingEnd}
        />
      </div>

      <BoardFooterActions
        nextStep={{
          callback:
            onBoard() == "school-grade-add"
              ? onClickAddGrade
              : onClickModifyGrade,
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
