import { createEffect, createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopStore } from "../../../../../_stores/stop.store";
import Button from "../../../../../component/atom/Button";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { CsvDiffType, CsvUtils } from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { StopUtils } from "../../../../../utils/stop.utils";
import { getLines } from "../../../map/component/organism/BusLines";
import { setSchools } from "../../../map/component/organism/SchoolPoints";
import { DialogToDisplayEnum, setDialogToDisplay } from "../organism/Dialogs";
import { DiffCollapsible } from "./DiffCollapsible";
import { CsvEnum, csv, csvType, diff, setCsvType } from "./ImportSelection";

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

  function diffFiltered(): CsvDiffType {
    return {
      added: diff()?.added.filter(
        (added) => !uncheckedValues()[DiffEnum.added].includes(added)
      ) as string[],
      modified: diff()?.modified.filter(
        (modified) => !uncheckedValues()[DiffEnum.modified].includes(modified)
      ) as number[],
      deleted: diff()?.deleted.filter(
        (deleted) => !uncheckedValues()[DiffEnum.deleted].includes(deleted)
      ) as number[],
    };
  }

  async function onClick() {
    setDialogToDisplay(DialogToDisplayEnum.none);
    enableSpinningWheel();

    switch (csvType()) {
      case CsvEnum.schools:
        const schools = await CsvUtils.importItems(
          csv() as File,
          diffFiltered(),
          CsvEnum.schools
        );
        setSchools(schools as SchoolType[]);
        break;

      case CsvEnum.stops:
        const stops = await CsvUtils.importItems(
          csv() as File,
          diffFiltered(),
          CsvEnum.stops
        );
        StopStore.set(stops as StopType[]);
        break;
    }

    setCsvType();
    disableSpinningWheel();
  }

  function noElementChecked() {
    if (
      diffFiltered().added.length == 0 &&
      diffFiltered().modified.length == 0 &&
      diffFiltered().deleted.length == 0
    ) {
      return true;
    }
    return false;
  }

  function isSchoolUsed(schoolId: number): boolean {
    if (SchoolUtils.get(schoolId).grades.length > 0) return true;
    if (
      getLines().some((line) =>
        line.schools.some((school) => school.id == schoolId)
      )
    ) {
      return true;
    }

    return false;
  }

  function isStopUsed(stopId: number): boolean {
    if (
      getLines().some((line) => line.stops.some((stop) => stop.id == stopId))
    ) {
      return true;
    }
    if (StopUtils.get(stopId).associated.length > 0) return true;

    return false;
  }

  function isItemUsed(id: number): boolean {
    return csvType() == CsvEnum.schools ? isSchoolUsed(id) : isStopUsed(id);
  }

  for (const id of diff()?.deleted as number[]) {
    if (isItemUsed(id)) {
      setUncheckedValues((prev) => {
        const uncheckedValues = { ...prev };
        uncheckedValues["deleted"].push(id);

        return uncheckedValues;
      });
    }
  }

  return (
    <>
      <div id="import-dialog-title">Modifications à appliquer :</div>
      <DiffCollapsible
        uncheckedValues={uncheckedValues}
        setter={setUncheckedValues}
        title="Ajouter"
        items={diff()?.added as string[]}
        diffType={DiffEnum.added}
      />
      <DiffCollapsible
        uncheckedValues={uncheckedValues}
        setter={setUncheckedValues}
        title="Modifier"
        items={diff()?.modified as number[]}
        diffType={DiffEnum.modified}
      />
      <DiffCollapsible
        uncheckedValues={uncheckedValues}
        setter={setUncheckedValues}
        title="Supprimer"
        items={diff()?.deleted as number[]}
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
