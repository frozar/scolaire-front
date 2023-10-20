import { createSignal, onCleanup } from "solid-js";
import { GradeType, HeureFormat } from "../../../../../_entities/grade.entity";
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

// eslint-disable-next-line solid/reactivity
export default function () {
  let defaultGrade: GradeType;
  // Case adding a new grade
  if (onBoard() == "school-grade-add") {
    const defaultTime = {
      hour: 0,
      minutes: 0,
    };
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

  const [morningStart, setMorningStart] = createSignal<HeureFormat>(
    defaultGrade.morningStart
  );
  const [morningEnd, setMorningEnd] = createSignal<HeureFormat>(
    defaultGrade.morningEnd
  );
  const [afternoonEnd, setAfternoonEnd] = createSignal<HeureFormat>(
    defaultGrade.afternoonEnd
  );
  const [afternoonStart, setAfternoonStart] = createSignal<HeureFormat>(
    defaultGrade.afternoonStart
  );

  function onInputGradeName(
    e: Event & {
      target: HTMLInputElement;
    }
  ) {
    setGradeName(e.target.value);
  }

  async function onClickAddGrade() {
    const schoolId = schoolDetailsItem()?.id;
    if (!schoolId) return;

    // TODO: Verify if schedules input different of "0:0" then display user message and return;

    const newGrade = await GradeService.create({
      schoolId: schoolId,
      name: gradeName(),
      morningStart: morningStart(),
      morningEnd: morningEnd(),
      afternoonStart: afternoonStart(),
      afternoonEnd: afternoonEnd(),
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
    const schoolId = schoolDetailsItem()?.id;
    if (!schoolId) return;

    const updatedGrade = await GradeService.update({
      ...selectedGrade(),
      name: gradeName(),
      morningStart: morningStart(),
      morningEnd: morningEnd(),
      afternoonStart: afternoonStart(),
      afternoonEnd: afternoonEnd(),
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
          <GradeLinkedSchool schools={[schoolDetailsItem()?.name as string]} />
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
          startSetter={setMorningStart}
          start={morningStart}
          endSetter={setMorningEnd}
          end={morningEnd}
        />
        <TimesInputWrapper
          label="Horaires après-midi"
          startSetter={setAfternoonStart}
          start={afternoonStart}
          endSetter={setAfternoonEnd}
          end={afternoonEnd}
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
