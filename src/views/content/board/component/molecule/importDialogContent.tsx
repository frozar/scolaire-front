import { Setter, createEffect, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import LabeledInputRadio from "./LabeledInputRadio";

export enum CsvTypeEnum {
  stop = "stops",
  schools = "schools",
  students = "students",
}
export default function (props: { setIsDisplayed: Setter<boolean> }) {
  const [importCsvType, setImportCsvType] = createSignal<CsvTypeEnum>();

  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    refButton()?.focus();
  });

  function closeDialog() {
    props.setIsDisplayed(false);
  }

  async function handlerOnClickSoumettre() {
    console.log("TODO");

    closeDialog();
  }

  function changeCsvType(csvType: string) {
    setImportCsvType(csvType as CsvTypeEnum);
    console.log("csvType selected =>", importCsvType());
  }
  return (
    <>
      <h3 class="dialog-title">Séléctionner un type de fichier:</h3>

      <LabeledInputRadio
        id="schools"
        value="schools"
        name="import-csv"
        labelName="Établissements"
        onChange={changeCsvType}
      />

      <LabeledInputRadio
        id="stops"
        value="stops"
        name="import-csv"
        labelName="Arrêts"
        onChange={changeCsvType}
      />

      <LabeledInputRadio
        id="students"
        value="students"
        name="import-csv"
        labelName="Élèves"
        onChange={changeCsvType}
      />

      {/* TODO: Refactor footer dialog content */}
      <div class="dialog-buttons">
        <Button
          onClick={closeDialog}
          label={"Annuler"}
          variant="danger"
          isDisabled={false}
        />
        <Button
          ref={setRefButton}
          onClick={handlerOnClickSoumettre}
          label={"Soumettre"}
          variant="primary"
          isDisabled={false}
        />
      </div>
    </>
  );
}
