import { JSXElement, Show, createEffect, createSignal } from "solid-js";
import { StudentDiffType } from "../../../../../utils/csv.utils";
import { DiffEnum } from "./ImportDiff";
import { studentDiff } from "./ImportSelection";
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

      newGrades: _studentDiff.newGrades.filter((gradeName) =>
        added
          .map((uncheckedValue) => uncheckedValue.grade_name)
          .includes(gradeName)
      ),
    };
  }

  createEffect(() =>
    console.log("studentDiffFiltered()", studentDiffFiltered())
  );
  return (
    <>
      <div id="import-dialog-title">Modifications à appliquer :</div>

      <Show when={(studentDiff() as StudentDiffType).newGrades.length > 0}>
        <div>{"Nouvelles classes" + studentDiff()?.newGrades}</div>
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
    </>
  );
}
