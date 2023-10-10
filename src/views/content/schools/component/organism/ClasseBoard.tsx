import { createSignal, onCleanup } from "solid-js";
import {
  ClasseType,
  HeureFormat,
} from "../../../../../_entities/classe.entity";
import { ClasseService } from "../../../../../_services/classe.service";
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
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import ClasseBoardHeader from "../molecule/ClasseBoardHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailsItem, setSchoolDetailsItem } from "./SchoolDetails";

export const [selectedClasse, setSelectedClasse] = createSignal<ClasseType>();

// eslint-disable-next-line solid/reactivity
export default function () {
  let defaultClasse: ClasseType;
  // Case adding a new classe
  if (onBoard() == "school-class-add") {
    const defaultTime = {
      hour: 0,
      minutes: 0,
    };
    defaultClasse = {
      name: "Nom de classe par défaut",
      morningStart: defaultTime,
      morningEnd: defaultTime,
      afternoonStart: defaultTime,
      afternoonEnd: defaultTime,
    };
    // Case modifying an existing classe
  } else {
    const classe = selectedClasse() as ClasseType;
    defaultClasse = {
      name: classe.name,
      morningStart: classe.morningStart,
      morningEnd: classe.morningEnd,
      afternoonStart: classe.afternoonStart,
      afternoonEnd: classe.afternoonEnd,
    };
  }

  const [classeName, setClasseName] = createSignal(defaultClasse.name);

  const [morningStart, setMorningStart] = createSignal<HeureFormat>(
    defaultClasse.morningStart
  );
  const [morningEnd, setMorningEnd] = createSignal<HeureFormat>(
    defaultClasse.morningEnd
  );
  const [afternoonEnd, setAfternoonEnd] = createSignal<HeureFormat>(
    defaultClasse.afternoonEnd
  );
  const [afternoonStart, setAfternoonStart] = createSignal<HeureFormat>(
    defaultClasse.afternoonStart
  );

  function onInputClasseName(
    e: Event & {
      target: HTMLInputElement;
    }
  ) {
    setClasseName(e.target.value);
  }

  async function onClickAddClasse() {
    const schoolId = schoolDetailsItem()?.id;
    if (!schoolId) return;

    // TODO: Verify if schedules input different of "0:0" then display user message and return;

    const newClasse = await ClasseService.create({
      schoolId: schoolId,
      name: classeName(),
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
        classes: [...schoolToModify.classes, newClasse],
      });
      return newSchools;
    });

    setSchoolDetailsItem(
      getSchools().filter((school) => school.id == schoolId)[0]
    );
    changeBoard("school-details");
  }

  async function onClickModifyClasse() {
    const schoolId = schoolDetailsItem()?.id;
    if (!schoolId) return;

    const updatedClasse = await ClasseService.update({
      ...selectedClasse(),
      name: classeName(),
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
        classes: [
          ...schoolToModify.classes.filter(
            (classe) => classe.id != updatedClasse.id
          ),
          updatedClasse,
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

  onCleanup(() => setSelectedClasse());

  return (
    <section>
      <ClasseBoardHeader
        title={
          onBoard() == "school-class-add"
            ? "Ajout d'une classe"
            : "Modifier une classe"
        }
      />

      <div class="content">
        <div class="line-height-1">
          <p>Ecole:</p>
          <ClasseLinkedSchool schools={[schoolDetailsItem()?.name as string]} />
        </div>

        <LabeledInputField
          name="classe-name"
          onInput={onInputClasseName}
          value={classeName()}
          label="Nom de la classe"
          placeholder="Nom de la classe"
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
            onBoard() == "school-class-add"
              ? onClickAddClasse
              : onClickModifyClasse,
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
