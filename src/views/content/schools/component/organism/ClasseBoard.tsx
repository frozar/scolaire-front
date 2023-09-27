import { createSignal } from "solid-js";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import ClasseLinkedSchool from "../atom/ClasseLinkedSchool";
import ClasseBoardHeader from "../molecule/ClasseBoardHeader";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailsItem } from "./SchoolDetails";

export type HeureFormat = {
  hour: number;
  minutes: number;
};

export default function () {
  const [classeName, setClasseName] = createSignal("");

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
    </section>
  );
}
