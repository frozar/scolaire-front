import { Accessor, Setter } from "solid-js";

import ClickOutside from "../../../../../component/ClickOutside";

true && ClickOutside;
export type DrawHelperDialogItemType = {
  value: Accessor<number>;
  setValue: Setter<number>;
  text: string;
  disabled: boolean;
};

export default function (props: DrawHelperDialogItemType) {
  // const [value, setValue] = createSignal(1);

  return (
    <div>
      <div class="sm:flex sm:items-start justify-center">
        <div class="mt-7 mr-2 max-w-xl text-sm text-gray-900 w-1/3">
          <p class="text-right">{props.text} :</p>
        </div>
        <form class="mt-5 sm:flex sm:items-center">
          <div class="w-full sm:max-w-xs">
            <label for="nb_vehicle" class="sr-only">
              {props.text}
            </label>
            <input
              type="number"
              name="nb_vehicle"
              id="nb_vehicle"
              class="block w-40 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-300"
              disabled={props.disabled}
              min={1}
              onChange={(evt: Event) => {
                if (!evt.target) {
                  return;
                }
                const target = evt.target as HTMLInputElement;
                props.setValue(parseInt(target.value));
              }}
              value={props.value()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
