import { Accessor, For, Setter, Show } from "solid-js";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../organism/CollapsibleElement";
import { DiffEnum, UncheckedElementType } from "./ImportDiff";

import "./DiffCollapsible.css";

function onChangeSchoolCheckbox(
  event: Event & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  },
  setter: Setter<UncheckedElementType>,
  elem: string | number,
  diffMode: DiffEnum
) {
  if (event.currentTarget.checked) {
    setter((prev) => {
      const unchecked = { ...prev };
      unchecked[diffMode] = unchecked[diffMode].filter((elt) => elt != elem);
      return unchecked;
    });
  } else {
    setter((prev) => {
      const unchecked: UncheckedElementType = { ...prev };
      unchecked[diffMode].push(elem as string);
      return unchecked;
    });
  }
}

export function DiffCollapsible(props: {
  uncheckedValues: Accessor<UncheckedElementType>;
  setter: Setter<UncheckedElementType>;
  title: string;
  schools: (number | string)[];
  diffType: DiffEnum;
}) {
  function isDisabled(school: number | string) {
    if (props.diffType != DiffEnum.deleted) return false;

    if (props.uncheckedValues()["deleted"].includes(school)) return true;

    return false;
  }

  return (
    <>
      <CollapsibleElement title={props.title}>
        <For each={props.schools}>
          {(elem) => {
            const disable = isDisabled(elem);
            return (
              <div class="input-checkbox">
                <div class="flex">
                  <input
                    type="checkbox"
                    checked={disable ? false : true}
                    disabled={disable}
                    value={elem}
                    onChange={(event) =>
                      onChangeSchoolCheckbox(
                        event,
                        props.setter,
                        elem,
                        props.diffType
                      )
                    }
                  />
                  <label classList={{ "input-label-disabled": disable }}>
                    {props.diffType == DiffEnum.added
                      ? elem
                      : SchoolUtils.getName(elem as number)}
                  </label>
                  <Show when={disable}>
                    <div class="ml-2">Établissement utilisé</div>
                  </Show>
                </div>
              </div>
            );
          }}
        </For>
      </CollapsibleElement>
    </>
  );
}
