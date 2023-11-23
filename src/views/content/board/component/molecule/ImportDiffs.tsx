import { createEffect, createSignal } from "solid-js";
import { SchoolDBType } from "../../../../../_entities/school.entity";
import Button from "../../../../../component/atom/Button";
import { SchoolsCsvDiffType } from "../../../../../utils/csv.utils";
import { DialogToDisplayEnum, setDialogToDisplay } from "../organism/Dialogs";
import DiffsCollapsible from "./DiffsCollapsible";
import { schoolsDiff } from "./importSelection";

export enum SchoolDiffEnum {
  added = "added",
  modified = "modified",
  deleted = "deleted",
}

export type UncheckedElementType = {
  [diffType: string]: (number | string)[];
};

export default function () {
  const [uncheckedValues, setUncheckedValues] =
    createSignal<UncheckedElementType>({
      added: [],
      modified: [],
      deleted: [],
    });

  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    refButton()?.focus();
  });

  function schoolsDiffFiltered(): SchoolsCsvDiffType {
    return {
      added: schoolsDiff()?.added.filter(
        (added) => !uncheckedValues()[SchoolDiffEnum.added].includes(added)
      ) as string[],
      modified: schoolsDiff()?.modified.filter(
        (modified) =>
          !uncheckedValues()[SchoolDiffEnum.modified].includes(modified)
      ) as number[],
      deleted: schoolsDiff()?.deleted.filter(
        (deleted) =>
          !uncheckedValues()[SchoolDiffEnum.deleted].includes(deleted)
      ) as number[],
    };
  }

  function noElementChecked() {
    if (
      schoolsDiffFiltered().added.length == 0 &&
      schoolsDiffFiltered().modified.length == 0 &&
      schoolsDiffFiltered().deleted.length == 0
    ) {
      return true;
    }
    return false;
  }

  createEffect(() =>
    console.log("schoolsDiffFiltered()", schoolsDiffFiltered())
  );

  return (
    <>
      <div id="import-dialog-title">Modifications à appliquer :</div>
      <DiffsCollapsible
        setter={setUncheckedValues}
        title="Ajouter"
        schools={schoolsDiff()?.added as string[]}
        diffType={SchoolDiffEnum.added}
      />
      <DiffsCollapsible
        setter={setUncheckedValues}
        title="Modifier"
        schools={schoolsDiff()?.modified as number[]}
        diffType={SchoolDiffEnum.modified}
      />
      <DiffsCollapsible
        setter={setUncheckedValues}
        title="Supprimer"
        schools={schoolsDiff()?.deleted as number[]}
        diffType={SchoolDiffEnum.deleted}
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
          onClick={handlerOnClick}
          label={"Valider"}
          variant="primary"
          isDisabled={noElementChecked()}
        />
      </div>
    </>
  );
}

function closeDialog() {
  setDialogToDisplay(DialogToDisplayEnum.none);
  // ! Signals to set to default ?
}

type importSchoolsDBType = {
  schools_to_add: Pick<SchoolDBType, "name" | "location">;
  schools_to_modify: Pick<SchoolDBType, "name" | "location">;
  schools_to_delete: number[];
};

function handlerOnClick() {
  // ! soit récupérer le parsedData déjà existant (signal)
  // ! soit le créer de nouveau (SchoolEntity.dataToDb)
  console.log("TODO IMPORT");
}
