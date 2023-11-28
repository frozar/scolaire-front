import { Setter, Show } from "solid-js";
import { DiffEnum, UncheckedElementType } from "../molecule/ImportDiff";

interface DiffCheckboxProps {
  item: string | number;
  label: string;
  disable: boolean;
  diffType: DiffEnum;
  setter: Setter<UncheckedElementType>;
}

export function DiffCheckbox(props: DiffCheckboxProps) {
  return (
    <div class="input-checkbox">
      <div class="flex">
        <input
          type="checkbox"
          checked={props.disable ? false : true}
          disabled={props.disable}
          value={props.item}
          onChange={(event) =>
            onChangeSchoolCheckbox(
              event,
              props.setter,
              props.item,
              props.diffType
            )
          }
        />
        <label classList={{ "input-label-disabled": props.disable }}>
          {props.label}
        </label>
        <Show when={props.disable}>
          <div class="ml-2">Utilisé</div>
        </Show>
      </div>
    </div>
  );
}

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
