import { createEffect, createSignal } from "solid-js";
import { SchoolsCsvDiffType } from "../../../../../utils/csv.utils";
import DiffsCollapsible from "./DiffsCollapsible";
import { schoolsDiff } from "./importTypeSelection";

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
    </>
  );
}
