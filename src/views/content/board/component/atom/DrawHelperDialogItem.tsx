import { Accessor, Setter } from "solid-js";

import ClickOutside from "../../../../../component/ClickOutside";
import "./DrawHelperDialogItem.css";

true && ClickOutside;
export type DrawHelperDialogItemType = {
  value: Accessor<number>;
  setValue: Setter<number>;
  text: string;
  disabled: boolean;
};
//TODO need to be refactored
export default function (props: DrawHelperDialogItemType) {
  return (
    <div>
      <div class="sm:flex sm:items-start justify-center">
        <div class="mt-7 mr-2 max-w-xl text-sm text-gray-900 w-1/3">
          <p class="text-right">{props.text} </p>
        </div>
        <form class="mt-5 sm:flex sm:items-center">
          <div class="w-full sm:max-w-xs">
            <label for="nb_vehicle" class="sr-only">
              {props.text}
            </label>
            <input
              type="number"
              class="draw-helper-input"
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
