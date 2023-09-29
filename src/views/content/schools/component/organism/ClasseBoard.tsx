import { createSignal } from "solid-js";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { changeBoard } from "../../../board/component/template/ContextManager";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import ClasseBoardHeader from "../molecule/ClasseBoardHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailsItem } from "./SchoolDetails";

export type HeureFormat = {
  hour: number;
  minutes: number;
};

export default function () {
  const [classeName, setClasseName] = createSignal("Nom de classe par défaut");

  const [morningStart, setMorningStart] = createSignal<HeureFormat>();
  const [morningEnd, setMorningEnd] = createSignal<HeureFormat>();
  const [afternoonEnd, setAfternoonEnd] = createSignal<HeureFormat>();
  const [afternoonStart, setAfternoonStart] = createSignal<HeureFormat>();

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
    console.log("add classe");
  }

  function onClickCancel() {
    changeBoard("school-details");
  }

  return (
    <section>
      <ClasseBoardHeader title="Ajout d'une ligne" />

      <div class="content">
        <div class="line-height-1">
          <p>Ecoles:</p>
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
          startSetter={setMorningStart}
          start={morningStart}
          endSetter={setMorningEnd}
          end={morningEnd}
        />
        <TimesInputWrapper
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
