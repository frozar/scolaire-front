import { Setter, createEffect, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import { CsvUtils } from "../../../../../utils/csv.utils";
import LabeledInputRadio from "./LabeledInputRadio";
import "./importDialogContent.css";

export enum CsvTypeEnum {
  stops = "stops",
  schools = "schools",
  students = "students",
}

export const [csvToImport, setCsvToImport] = createSignal<File>();

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
    // TODO: Uncheck all radios
  }

  async function handlerOnClickSoumettre() {
    switch (importCsvType()) {
      case CsvTypeEnum.schools:
        console.log("file =>", csvToImport());
        // ! Faire afficher la page de diffs
        CsvUtils.getImportSchoolsCsvDiff(csvToImport() as File);
        break;

      case CsvTypeEnum.stops:
        console.log("todo stops");
        break;

      case CsvTypeEnum.students:
        console.log("todo students");
        break;
    }

    closeDialog();
  }

  function changeCsvType(csvType: string) {
    setImportCsvType(csvType as CsvTypeEnum);
    console.log("csvType selected =>", importCsvType());
  }

  return (
    // ! Ici mettre un switch pour afficher
    // ! soit sélection du type de fichier
    // ! soit diffs !
    <>
      <div id="import-dialog-title">Séléctionner le type de fichier:</div>

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
      <div class="import-dialog-buttons">
        <Button
          onClick={closeDialog}
          label={"Annuler"}
          variant="danger"
          isDisabled={false}
        />
        <Button
          ref={setRefButton}
          onClick={handlerOnClickSoumettre}
          label={"Valider"}
          variant="primary"
          isDisabled={importCsvType() == undefined}
        />
      </div>
    </>
  );
}
