import { For, Setter, createEffect, createSignal } from "solid-js";
import { SchoolsCsvDiffType } from "../../../../../utils/csv.utils";
import CollapsibleElement from "../organism/CollapsibleElement";
import { schoolsDiff } from "./importTypeSelection";

enum SchoolDiffEnum {
  added = "added",
  modified = "modified",
  deleted = "deleted",
}

// TODO: Clean => do not use switch cases here !
function onChangeSchoolCheckbox(
  event: Event & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  },
  setter: Setter<SchoolsCsvDiffType>,
  elem: string | number,
  diffMode: SchoolDiffEnum
) {
  !event.currentTarget.checked
    ? setter((prev) => {
        const unchecked = { ...prev };
        switch (diffMode) {
          case SchoolDiffEnum.added:
            unchecked.added.push(elem as string);
            break;
          case SchoolDiffEnum.modified:
            unchecked.modified.push(elem as number);
            break;
          case SchoolDiffEnum.deleted:
            unchecked.deleted.push(elem as number);
            break;
        }
        return unchecked;
      })
    : setter((prev) => {
        let unchecked: {
          added: string[];
          modified: number[];
          deleted: number[];
        };
        switch (diffMode) {
          case SchoolDiffEnum.added:
            unchecked = {
              ...prev,
              added: prev.added.filter((added) => added != elem),
            };
            break;
          case SchoolDiffEnum.modified:
            unchecked = {
              ...prev,
              modified: prev.modified.filter((modified) => modified != elem),
            };

            break;
          case SchoolDiffEnum.deleted:
            unchecked = {
              ...prev,
              deleted: prev.deleted.filter((deleted) => deleted != elem),
            };
            break;
        }
        return unchecked;
      });
}

export default function () {
  const [uncheckedValues, setUncheckedValues] =
    createSignal<SchoolsCsvDiffType>({
      added: [],
      modified: [],
      deleted: [],
    });

  function schoolsDiffFiltered() {
    return {
      added: schoolsDiff()?.added.filter(
        (added) => !uncheckedValues().added.includes(added)
      ),
    };
  }

  createEffect(() =>
    console.log("schoolsDiffFiltered()", schoolsDiffFiltered())
  );

  return (
    <>
      <div id="import-dialog-title">Modifications à appliquer :</div>
      <CollapsibleElement title="Ajouter">
        <For each={schoolsDiff()?.added as string[]}>
          {(elem) => {
            return (
              // TODO: Use as a component and refactor with other checkboxes
              <div class="input-checkbox">
                <input
                  type="checkbox"
                  checked={true}
                  // id={props.id}
                  // name={props.name}
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
      </CollapsibleElement>
      <CollapsibleElement title="Modifier">
        <div>TODO</div>
      </CollapsibleElement>
      <CollapsibleElement title="Supprimer">
        <div>TODO</div>
      </CollapsibleElement>
    </>
  );
}
