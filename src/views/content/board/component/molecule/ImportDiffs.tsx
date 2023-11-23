import { createEffect, createSignal } from "solid-js";
import { SchoolsCsvDiffType } from "../../../../../utils/csv.utils";
import DiffsTypeCollapsible from "./DiffsTypeCollapsible";
import { schoolsDiff } from "./importTypeSelection";

export enum SchoolDiffEnum {
  added = "added",
  modified = "modified",
  deleted = "deleted",
}

export type UncheckedType = { [diffType: string]: (number | string)[] };

// function onChangeSchoolCheckbox(
//   event: Event & {
//     currentTarget: HTMLInputElement;
//     target: HTMLInputElement;
//   },
//   setter: Setter<UncheckedType>,
//   elem: string | number,
//   diffMode: SchoolDiffEnum
// ) {
//   if (event.currentTarget.checked) {
//     setter((prev) => {
//       const unchecked = { ...prev };
//       unchecked[diffMode] = unchecked[diffMode].filter((elt) => elt != elem);
//       return unchecked;
//     });
//   } else {
//     setter((prev) => {
//       const unchecked: UncheckedType = { ...prev };
//       unchecked[diffMode].push(elem as string);
//       return unchecked;
//     });
//   }
// }

export default function () {
  const [uncheckedValues, setUncheckedValues] = createSignal<UncheckedType>({
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
      <DiffsTypeCollapsible
        setter={setUncheckedValues}
        title="Ajouter"
        toIterOn={schoolsDiff()?.added as string[]}
        diffType={SchoolDiffEnum.added}
      />
      {/* <CollapsibleElement title="Ajouter">
        <For each={schoolsDiff()?.added as string[]}>
          {(elem) => {
            return (
              // TODO: Use as a component and refactor with other checkboxes
              <div class="input-checkbox">
                <input
                  type="checkbox"
                  checked={true}
                  value={elem}
                  onChange={(event) =>
                    onChangeSchoolCheckbox(
                      event,
                      setUncheckedValues,
                      elem,
                      SchoolDiffEnum.added
                    )
                  }
                />
                <label>{elem}</label>
              </div>
            );
          }}
        </For>
      </CollapsibleElement> */}
      <DiffsTypeCollapsible
        setter={setUncheckedValues}
        title="Modifier"
        toIterOn={schoolsDiff()?.modified as number[]}
        diffType={SchoolDiffEnum.modified}
      />
      {/* <CollapsibleElement title="Modifier">
        <For each={schoolsDiff()?.modified as number[]}>
          {(elem) => {
            return (
              // TODO: Use as a component and refactor with other checkboxes
              <div class="input-checkbox">
                <input
                  type="checkbox"
                  checked={true}
                  value={elem}
                  onChange={(event) =>
                    onChangeSchoolCheckbox(
                      event,
                      setUncheckedValues,
                      elem,
                      SchoolDiffEnum.modified
                    )
                  }
                />
                <label>{SchoolUtils.getName(elem)}</label>
              </div>
            );
          }}
        </For>
      </CollapsibleElement> */}
      <DiffsTypeCollapsible
        setter={setUncheckedValues}
        title="Supprimer"
        toIterOn={schoolsDiff()?.deleted as number[]}
        diffType={SchoolDiffEnum.deleted}
      />
      {/* <CollapsibleElement title="Supprimer">
        <For each={schoolsDiff()?.deleted as number[]}>
          {(elem) => {
            return (
              // TODO: Use as a component and refactor with other checkboxes
              <div class="input-checkbox">
                <input
                  type="checkbox"
                  checked={true}
                  value={elem}
                  onChange={(event) =>
                    onChangeSchoolCheckbox(
                      event,
                      setUncheckedValues,
                      elem,
                      SchoolDiffEnum.deleted
                    )
                  }
                />
                <label>{SchoolUtils.getName(elem)}</label>
              </div>
            );
          }}
        </For>
      </CollapsibleElement> */}
    </>
  );
}
