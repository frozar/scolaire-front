import { For, Setter } from "solid-js";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../organism/CollapsibleElement";
import { DiffEnum, UncheckedElementType } from "./ImportDiff";

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
  setter: Setter<UncheckedElementType>;
  title: string;
  schools: (number | string)[];
  diffType: DiffEnum;
}) {
  return (
    <>
      <CollapsibleElement title={props.title}>
        <For each={props.schools}>
          {(elem) => {
            return (
              // TODO: Create a css for this file !
              <div class="input-checkbox">
                <input
                  type="checkbox"
                  checked={true}
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
                <label>
                  {props.diffType == DiffEnum.added
                    ? elem
                    : SchoolUtils.getName(elem as number)}
                </label>
              </div>
            );
          }}
        </For>
      </CollapsibleElement>
    </>
  );
}
