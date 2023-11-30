import { JSXElement, Show, createEffect, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { CsvUtils, StudentDiffType } from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { DialogToDisplayEnum, setDialogToDisplay } from "../organism/Dialogs";
import { DiffEnum } from "./ImportDiff";
import { setCsvType, studentDiff } from "./ImportSelection";
import { StudentDiffCollapsible } from "./StudentDiffCollapsible";

export type UncheckedStudents = Omit<
  StudentDiffType,
  "newGrades" | "nbOfLineIgnored"
>;

export function ImportDiffStudent(): JSXElement {
  const [uncheckedValues, setUncheckedValues] = createSignal<UncheckedStudents>(
    {
      added: [],
      modified: [],
      deleted: [],
    }
  );

  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  function studentDiffFiltered(): Omit<StudentDiffType, "nbOfLineIgnored"> {
    const _studentDiff = studentDiff() as StudentDiffType;

    const added = _studentDiff.added.filter((student) => {
      for (const uncheckedValue of uncheckedValues().added) {
        if (
          student.stop_name == uncheckedValue.stop_name &&
          student.grade_name == uncheckedValue.grade_name &&
          student.quantity == uncheckedValue.quantity
        ) {
          return false;
        }
      }
      return true;
    });

    return {
      added,

      modified: _studentDiff.modified.filter(
        (student) =>
          !uncheckedValues()
            .modified.map((uncheckedValue) => uncheckedValue.id)
            .includes(student.id)
      ),

      deleted: _studentDiff.deleted.filter(
        (gradeId) => !uncheckedValues().deleted.includes(gradeId)
      ),

      newGrades: _studentDiff.newGrades.filter((newGrade) =>
        added
          .map((uncheckedValue) => uncheckedValue.grade_name)
          .includes(newGrade.gradeName)
      ),
    };
  }

  function noElementChecked() {
    if (
      studentDiffFiltered().added.length == 0 &&
      studentDiffFiltered().modified.length == 0 &&
      studentDiffFiltered().deleted.length == 0
    ) {
      return true;
    }
    return false;
  }

  createEffect(() => {
    refButton()?.focus();
  });

  createEffect(() =>
    console.log("studentDiffFiltered()", studentDiffFiltered())
  );
  return (
    <>
      <div id="import-dialog-title">Modifications à appliquer :</div>

      <Show when={(studentDiff() as StudentDiffType).newGrades.length > 0}>
        <div>
          {"Nouvelles classes: " +
            studentDiff()?.newGrades.map((grade) => grade.gradeName)}
        </div>
      </Show>

      <Show when={(studentDiff() as StudentDiffType).nbOfLineIgnored > 0}>
        <div>
          {(studentDiff() as StudentDiffType).nbOfLineIgnored +
            " lignes ignorées car établissement et/ou arrêt innexistant"}
        </div>
      </Show>

      <StudentDiffCollapsible
        diffType={DiffEnum.added}
        uncheckedValues={uncheckedValues}
        setUncheckedValues={setUncheckedValues}
      />
      <StudentDiffCollapsible
        diffType={DiffEnum.modified}
        uncheckedValues={uncheckedValues}
        setUncheckedValues={setUncheckedValues}
      />
      <StudentDiffCollapsible
        diffType={DiffEnum.deleted}
        uncheckedValues={uncheckedValues}
        setUncheckedValues={setUncheckedValues}
      />

      {/* TODO: Refactor footer dialog content */}
      <div class="import-dialog-buttons">
        <Button
          // ! Signals to clean ?
          onClick={DialogUtils.closeDialog}
          label={"Annuler"}
          variant="danger"
          isDisabled={false}
        />
        <Button
          ref={setRefButton}
          onClick={() => onClick(studentDiffFiltered())}
          label={"Valider"}
          variant="primary"
          isDisabled={noElementChecked()}
        />
      </div>
    </>
  );
}

async function onClick(
  studentDiffFiltered: Omit<StudentDiffType, "nbOfLineIgnored">
) {
  setDialogToDisplay(DialogToDisplayEnum.none);
  enableSpinningWheel();

  // ! Ici
  CsvUtils.importStudents(studentDiffFiltered);

  setCsvType();
  disableSpinningWheel();
}
