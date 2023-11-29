import { Setter } from "solid-js";
import {
  StudentCsv,
  StudentModifiedDiff,
} from "../../../../../utils/csv.utils";
import { DiffEnum } from "../molecule/ImportDiff";
import { UncheckedStudents } from "../molecule/ImportDiffStudents";

interface DiffCheckboxProps {
  item: number | StudentCsv | StudentModifiedDiff;
  label: string;
  diffType: DiffEnum;
  setter: Setter<UncheckedStudents>;
}

export function DiffCheckboxStudent(props: DiffCheckboxProps) {
  return (
    <div class="input-checkbox">
      <div class="flex">
        <input
          type="checkbox"
          checked={true}
          onChange={(event) =>
            onChangeStudentCheckbox(
              event,
              props.setter,
              props.item,
              props.diffType
            )
          }
        />
        <label>{props.label}</label>
      </div>
    </div>
  );
}

function onChangeStudentCheckbox(
  event: Event & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  },
  setter: Setter<UncheckedStudents>,
  item: number | StudentCsv | StudentModifiedDiff,
  diffType: DiffEnum
) {
  switch (diffType) {
    case DiffEnum.added:
      const addedItem = item as StudentCsv;
      if (event.currentTarget.checked) {
        // ! quand je coche

        setter((prev) => {
          let addedList = { ...prev }.added;

          addedList = addedList.filter(
            (added) =>
              !(
                added.grade_name == addedItem.grade_name &&
                added.stop_name == addedItem.stop_name
              )
          );

          return { ...prev, added: addedList };
        });
        // ! Quand je décoche
      } else {
        setter((prev) => {
          const added = { ...prev }.added;
          added.push(addedItem);
          return { ...prev, added: added };
        });
      }
      break;

    default:
      break;
  }
}
