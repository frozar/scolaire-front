import { Setter } from "solid-js";
import {
  StudentCsv,
  StudentModifiedDiff,
} from "../../../../../utils/csv.utils";
import { DiffEnum } from "../molecule/ImportDiff";
import { UncheckedStudents } from "../molecule/ImportDiffStudents";
import "./DiffCheckboxStudent.css";

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
        <label class="label-checkbox-student">{props.label}</label>
      </div>
    </div>
  );
}

function onChangeStudentCheckbox(
  event: onChangeEvent,
  setter: Setter<UncheckedStudents>,
  item: number | StudentCsv | StudentModifiedDiff,
  diffType: DiffEnum
) {
  switch (diffType) {
    case DiffEnum.added:
      const addedItem = item as StudentCsv;
      uncheckAddedItem(event, addedItem, setter);
      break;

    case DiffEnum.modified:
      const modifiedItem = item as StudentModifiedDiff;
      uncheckModifiedItem(event, modifiedItem, setter);
      break;

    case DiffEnum.deleted:
      const itemId = item as number;
      uncheckDeletedItem(event, itemId, setter);
      break;
  }
}

function uncheckDeletedItem(
  event: onChangeEvent,
  itemId: number,
  setter: Setter<UncheckedStudents>
): void {
  if (event.currentTarget.checked) {
    setter((prev) => {
      let uncheckedDeletedIds = { ...prev }.deleted;
      uncheckedDeletedIds = uncheckedDeletedIds.filter(
        (deletedId) => deletedId != itemId
      );
      return { ...prev, deleted: uncheckedDeletedIds };
    });
  } else {
    setter((prev) => {
      const uncheckedDeletedIds = { ...prev }.deleted;
      uncheckedDeletedIds.push(itemId);
      return { ...prev, deleted: uncheckedDeletedIds };
    });
  }
}

function uncheckModifiedItem(
  event: onChangeEvent,
  modifiedItem: StudentModifiedDiff,
  setter: Setter<UncheckedStudents>
): void {
  if (event.currentTarget.checked) {
    setter((prev) => {
      let uncheckedModified = { ...prev }.modified;
      uncheckedModified = uncheckedModified.filter(
        (unchecked) => unchecked.id != modifiedItem.id
      );
      return { ...prev, modified: uncheckedModified };
    });
  } else {
    setter((prev) => {
      const uncheckedModified = { ...prev }.modified;
      uncheckedModified.push(modifiedItem);
      return { ...prev, modified: uncheckedModified };
    });
  }
}

function uncheckAddedItem(
  event: onChangeEvent,
  addedItem: StudentCsv,
  setter: Setter<UncheckedStudents>
): void {
  if (event.currentTarget.checked) {
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
  } else {
    setter((prev) => {
      const added = { ...prev }.added;
      added.push(addedItem);
      return { ...prev, added: added };
    });
  }
}

type onChangeEvent = Event & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};
