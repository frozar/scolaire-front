import { For, Setter } from "solid-js";
import CollapsibleElement from "../organism/CollapsibleElement";
import { SchoolDiffEnum, UncheckedType } from "./ImportDiffs";

// TODO: Rename file

function onChangeSchoolCheckbox(
  event: Event & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  },
  setter: Setter<UncheckedType>,
  elem: string | number,
  diffMode: SchoolDiffEnum
) {
  if (event.currentTarget.checked) {
    setter((prev) => {
      const unchecked = { ...prev };
      unchecked[diffMode] = unchecked[diffMode].filter((elt) => elt != elem);
      return unchecked;
    });
  } else {
    setter((prev) => {
      const unchecked: UncheckedType = { ...prev };
      unchecked[diffMode].push(elem as string);
      return unchecked;
    });
  }
}

export default function (props: {
  setter: Setter<UncheckedType>;
  title: string;
  // ! Delete and use dict for schoolsDiffs()!
  toIterOn: (number | string)[];
  diffType: SchoolDiffEnum;
}) {
  return (
    <>
      <CollapsibleElement title={props.title}>
        <For each={props.toIterOn}>
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
                <label>{elem}</label>
              </div>
            );
          }}
        </For>
      </CollapsibleElement>
    </>
  );
}
