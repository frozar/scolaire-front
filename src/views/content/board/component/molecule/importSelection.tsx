import { createEffect, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import { CsvUtils, SchoolsCsvDiffType } from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { DialogToDisplayEnum, setDialogToDisplay } from "../organism/Dialogs";
import LabeledInputRadio from "./LabeledInputRadio";
import "./importSelection.css";

export enum CsvTypeEnum {
  stops = "stops",
  schools = "schools",
  students = "students",
}

export const [csvToImport, setCsvToImport] = createSignal<File>();
export const [schoolsDiff, setSchoolsDiff] = createSignal<SchoolsCsvDiffType>();

export default function () {
  const [importCsvType, setImportCsvType] = createSignal<CsvTypeEnum>();
  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    refButton()?.focus();
  });

  async function handlerOnClick() {
    switch (importCsvType()) {
      case CsvTypeEnum.schools:
        const diff = await CsvUtils.getImportSchoolsCsvDiff(
          csvToImport() as File
        );
        console.log("diff =>", diff);
        setSchoolsDiff(diff);
        setDialogToDisplay(DialogToDisplayEnum.diff);
        return;

      case CsvTypeEnum.stops:
        console.log("todo stops");
        break;

      case CsvTypeEnum.students:
        console.log("todo students");
        break;
    }

    DialogUtils.closeDialog();
  }

  function changeCsvType(csvType: string) {
    setImportCsvType(csvType as CsvTypeEnum);
  }

  return (
    <>
      <div id="import-dialog-title">Séléctionner le type d'import :</div>

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
          onClick={DialogUtils.closeDialog}
          label={"Annuler"}
          variant="danger"
          isDisabled={false}
        />
        <Button
          ref={setRefButton}
          onClick={handlerOnClick}
          label={"Valider"}
          variant="primary"
          isDisabled={importCsvType() == undefined}
        />
      </div>
    </>
  );
}
