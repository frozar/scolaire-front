// TODO: Refactor whit ClasseBoard.tsx

import { createSignal } from "solid-js";
import { ClasseType } from "../../../../../_entities/classe.entity";
import { ClasseService } from "../../../../../_services/classe.service";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { changeBoard } from "../../../board/component/template/ContextManager";
import {
  getSchools,
  setSchools,
} from "../../../map/component/organism/SchoolPoints";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import ClasseBoardHeader from "../molecule/ClasseBoardHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailsItem, setSchoolDetailsItem } from "./SchoolDetails";

type HeureFormat = {
  hour: number;
  minutes: number;
};
// TODO: Mettre en place vider un signal
export const [selectedClasse, setSelectedClasse] = createSignal<ClasseType>();
// ! ??
// eslint-disable-next-line solid/reactivity
export default function () {
  // const defaultTime = {
  //   hour: 0,
  //   minutes: 0,
  // };
  // const school = schoolDetailsItem() as SchoolType;
  // if (!school) return <></>;

  // const classe = school.classes.filter(
  //   (classe) => classe.id == selectedClasse()
  // )[0];
  const classe = selectedClasse() as ClasseType;

  const [classeName, setClasseName] = createSignal(classe.name);

  const [morningStart, setMorningStart] = createSignal<HeureFormat>(
    classe.morningStart
  );
  const [morningEnd, setMorningEnd] = createSignal<HeureFormat>(
    classe.morningEnd
  );
  const [afternoonEnd, setAfternoonEnd] = createSignal<HeureFormat>(
    classe.afternoonEnd
  );
  const [afternoonStart, setAfternoonStart] = createSignal<HeureFormat>(
    classe.afternoonStart
  );

  function onInputClasseName(
    e: Event & {
      target: HTMLInputElement;
    }
  ) {
    setClasseName(e.target.value);
  }

  // async function onClickAddClasse() {
  //   const schoolId = schoolDetailsItem()?.id;
  //   if (!schoolId) return;

  //   setSchoolDetailsItem(
  //     getSchools().filter((school) => school.id == schoolId)[0]
  //   );
  //   changeBoard("school-details");
  // }
  // TODO:
  async function onClickModifyClasse() {
    const schoolId = schoolDetailsItem()?.id;
    if (!schoolId) return;
    console.log("selectedClasse() ====>", selectedClasse());
    const modifiedClasse: ClasseType = {
      ...selectedClasse(),
      name: classeName(),
      morningStart: morningStart(),
      morningEnd: morningEnd(),
      afternoonStart: afternoonStart(),
      afternoonEnd: afternoonEnd(),
    };
    console.log("modified classe ====>", modifiedClasse);

    const updatedClasse = await ClasseService.update(modifiedClasse);
    console.log("updatedClasse", updatedClasse);
    // TODO: Ajouter aux données locales
    setSchools((prev) => {
      const schoolToModify = prev.filter((school) => school.id == schoolId)[0];
      // TODO: Fix old classe not deleted
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
    console.log("updated Schools =>", getSchools());

    // TODO: Switch de board
    setSchoolDetailsItem(
      getSchools().filter((school) => school.id == schoolId)[0]
    );
    console.log("updated schoolDetailsItem =>", schoolDetailsItem());
    changeBoard("school-details");
  }

  function onClickCancel() {
    changeBoard("school-details");
  }

  return (
    <section>
      {/* <ClasseBoardHeader title="Ajout d'une classe" /> */}
      <ClasseBoardHeader title="Modifier une classe" />

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
          callback: onClickModifyClasse,
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
