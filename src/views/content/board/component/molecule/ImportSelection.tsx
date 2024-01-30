import { createEffect, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import {
  CsvDiffType,
  CsvUtils,
  StudentDiffType,
} from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { DialogToDisplayEnum, setDialogToDisplay } from "../organism/Dialogs";
import LabeledInputRadio from "./LabeledInputRadio";
import "./importSelection.css";

export enum CsvEnum {
  stops = "stops",
  schools = "schools",
  students = "students",
}

export const [csv, setCsv] = createSignal<File>();
export const [diff, setDiff] = createSignal<CsvDiffType>();
export const [studentDiff, setStudentDiff] = createSignal<StudentDiffType>();
export const [csvType, setCsvType] = createSignal<CsvEnum>();

export function ImportSelection() {
  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    refButton()?.focus();
  });

  async function onClick() {
    let diff: CsvDiffType;
    switch (csvType()) {
      case CsvEnum.schools:
        diff = await CsvUtils.getDiff(csv() as File, CsvEnum.schools);
        setDiff(diff);
        setDialogToDisplay(DialogToDisplayEnum.diff);
        return;

      case CsvEnum.stops:
        diff = await CsvUtils.getDiff(csv() as File, CsvEnum.stops);

        setDiff(diff);
        setDialogToDisplay(DialogToDisplayEnum.diff);
        return;

      case CsvEnum.students:
        const studentDiff = await CsvUtils.getStudentsDiff(csv() as File);
        setStudentDiff(studentDiff);
        setDialogToDisplay(DialogToDisplayEnum.studentDiff);

        return;
    }

    DialogUtils.closeDialog();
  }

  function changeCsvType(csvType: string) {
    setCsvType(csvType as CsvEnum);
  }

  return (
    <>
      <div id="import-dialog-title">Séléctionner le type d'import :</div>
      <div id="import-file-name">{csv()?.name}</div>

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
          onClick={onClick}
          label={"Valider"}
          variant="primary"
          isDisabled={csvType() == undefined}
        />
      </div>
    </>
  );
}
