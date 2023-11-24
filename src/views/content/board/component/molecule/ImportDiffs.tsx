import { createEffect, createSignal } from "solid-js";
import { SchoolDBType } from "../../../../../_entities/school.entity";
import { SchoolService } from "../../../../../_services/school.service";
import Button from "../../../../../component/atom/Button";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { CsvUtils, SchoolsCsvDiffType } from "../../../../../utils/csv.utils";
import { DialogUtils } from "../../../../../utils/dialog.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { setSchools } from "../../../map/component/organism/SchoolPoints";
import DiffsCollapsible from "./DiffsCollapsible";
import { csvToImport, schoolsDiff } from "./importSelection";

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

  // TODO: Clean
  async function handlerOnClick() {
    const file = csvToImport() as File;
    const parsedFileData = (await CsvUtils.parsedCsvFileToSchoolData(
      file
    )) as Pick<SchoolDBType, "name" | "location">[];

    const diffDbData: importSchoolsDBType = {
      schools_to_add: [],
      schools_to_modify: [],
      schools_to_delete: [],
    };
    schoolsDiffFiltered().deleted.forEach((schoolIid) =>
      diffDbData.schools_to_delete.push(schoolIid)
    );
    schoolsDiffFiltered().added.forEach((name) => {
      const school = parsedFileData.filter((school) => school.name == name)[0];
      diffDbData.schools_to_add.push(school);
    });
    schoolsDiffFiltered().modified.forEach((schoolId) => {
      const school = SchoolUtils.get(schoolId);
      const location = parsedFileData.filter(
        (data) => data.name == school.name
      )[0].location;
      diffDbData.schools_to_modify.push({ id: school.id, location });
    });
    console.log("DB Data =>", diffDbData);
    DialogUtils.closeDialog();
    enableSpinningWheel();
    const schools = await SchoolService.import(diffDbData);
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
          isDisabled={noElementChecked()}
        />
      </div>
    </>
  );
}

export type importSchoolsDBType = {
  schools_to_add: Pick<SchoolDBType, "name" | "location">[];
  schools_to_modify: Pick<SchoolDBType, "id" | "location">[];
  schools_to_delete: number[];
};
