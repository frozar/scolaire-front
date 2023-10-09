import { createSignal } from "solid-js";
import { ClasseType } from "../../../../../_entities/classe.entity";
import { ClasseService } from "../../../../../_services/classe.service";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSchools } from "../../../map/component/organism/SchoolPoints";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import ClasseBoardHeader from "../molecule/ClasseBoardHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailsItem } from "./SchoolDetails";

export type HeureFormat = {
  hour: number;
  minutes: number;
};

export default function () {
  const defaultTime = {
    hour: 0,
    minutes: 0,
  };
  const [classeName, setClasseName] = createSignal("Nom de classe par défaut");

  const [morningStart, setMorningStart] =
    createSignal<HeureFormat>(defaultTime);
  const [morningEnd, setMorningEnd] = createSignal<HeureFormat>(defaultTime);
  const [afternoonEnd, setAfternoonEnd] =
    createSignal<HeureFormat>(defaultTime);
  const [afternoonStart, setAfternoonStart] =
    createSignal<HeureFormat>(defaultTime);

  function onInputClasseName(
    e: Event & {
      target: HTMLInputElement;
    }
  ) {
    setClasseName(e.target.value);
  }

  function onClickAddClasse() {
    // TODO add request to add classe into database for the current school
    // TODO Into database add schedule table to register the start/end hour day for the morning and the afternoon of classes
    const newClasse: ClasseType = {
      schoolId: schoolDetailsItem()?.id as number,
      name: classeName(),
      morningStart: morningStart(),
      morningEnd: morningEnd(),
      afternoonStart: afternoonStart(),
      afternoonEnd: afternoonEnd(),
    };
    const returnedValue = ClasseService.create(newClasse);
    console.log("classe added =>", newClasse);
    console.log("service returned value =>", returnedValue);
    // TODO: Ajouter à school
    setSchools((prev) => {
      const schoolToModify = prev.filter(
        (school) => school.id == schoolDetailsItem()?.id
      )[0];
      const newSchools = [...prev].filter(
        (school) => school.id != schoolDetailsItem()?.id
      );
      newSchools.push({
        ...schoolToModify,
        classes: [...schoolToModify.classes, newClasse],
      });
      return newSchools;
    });
    // TODO: Switch à un autre menu
  }

  function onClickCancel() {
    changeBoard("school-details");
  }

  return (
    <section>
      <ClasseBoardHeader title="Ajout d'une classe" />

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
          callback: onClickAddClasse,
          label: "Suivant",
        }}
        previousStep={{
          callback: onClickCancel,
          label: "Annuler",
        }}
      />
    </section>
  );
}
