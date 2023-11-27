import { createEffect, createSignal } from "solid-js";
import Button from "../../../../../component/atom/Button";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { CsvUtils, SchoolsCsvDiffType } from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { setSchools } from "../../../map/component/organism/SchoolPoints";
import { DiffCollapsible } from "./DiffCollapsible";
import { csv, schoolsDiff } from "./ImportSelection";

export enum DiffEnum {
  added = "added",
  modified = "modified",
  deleted = "deleted",
}

export type UncheckedElementType = {
  [diffType: string]: (number | string)[];
};

export function ImportDiff() {
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
        (added) => !uncheckedValues()[DiffEnum.added].includes(added)
      ) as string[],
      modified: schoolsDiff()?.modified.filter(
        (modified) => !uncheckedValues()[DiffEnum.modified].includes(modified)
      ) as number[],
      deleted: schoolsDiff()?.deleted.filter(
        (deleted) => !uncheckedValues()[DiffEnum.deleted].includes(deleted)
      ) as number[],
    };
  }

  async function onClick() {
    DialogUtils.closeDialog();
    enableSpinningWheel();

    const schools = await CsvUtils.importSchools(
      csv() as File,
      schoolsDiffFiltered()
    );

    setSchools(schools);
    disableSpinningWheel();
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

  return (
    <>
      <div id="import-dialog-title">Modifications à appliquer :</div>
      <DiffCollapsible
        setter={setUncheckedValues}
        title="Ajouter"
        schools={schoolsDiff()?.added as string[]}
        diffType={DiffEnum.added}
      />
      <DiffCollapsible
        setter={setUncheckedValues}
        title="Modifier"
        schools={schoolsDiff()?.modified as number[]}
        diffType={DiffEnum.modified}
      />
      <DiffCollapsible
        setter={setUncheckedValues}
        title="Supprimer"
        schools={schoolsDiff()?.deleted as number[]}
        diffType={DiffEnum.deleted}
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
          isDisabled={noElementChecked()}
        />
      </div>
    </>
  );
}
