import { JSXElement, Show, createEffect, createSignal } from "solid-js";
import { StudentDiffType } from "../../../../../utils/csv.utils";
import { DiffEnum } from "./ImportDiff";
import { studentDiff } from "./ImportSelection";
import { StudentDiffCollapsible } from "./StudentDiffCollapsible";

export type UncheckedStudents = Omit<StudentDiffType, "newGrades">;

export function ImportDiffStudent(): JSXElement {
  const [uncheckedValues, setUncheckedValues] = createSignal<UncheckedStudents>(
    {
      added: [],
      modified: [],
      deleted: [],
    }
  );

  function studentDiffFiltered(): StudentDiffType {
    const _studentDiff = studentDiff() as StudentDiffType;
    console.log("uncheckedValues()", uncheckedValues());

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
        <div>{"Classes à créer:" + studentDiff()?.newGrades}</div>
      </Show>
      {/* TODO: Show numbers of line removed (school or stop not existing) */}

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
