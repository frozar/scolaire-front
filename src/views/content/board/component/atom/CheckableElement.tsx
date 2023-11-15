import { Show } from "solid-js";
import { QuantityUtils } from "../../../../../utils/quantity.utils";

export type CheckableElementType = {
  name: string;
  id: number;
  checked: boolean;
  display: boolean;
  onChange: (e: CheckableEventType, indice: number) => void;
};

export type CheckableEventType = Event & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

export function CheckableElement(props: {
  content: CheckableElementType;
  indice: number;
  displayQuantity: boolean;
}) {
  return (
    <Show when={props.content.display}>
      <div class="flex items-center">
        <input
          id="comments"
          name="comments"
          type="checkbox"
          checked={props.content.checked}
          onChange={(e) => {
            props.content.onChange(e, props.indice);
          }}
          class="h-4 w-5 mr-4 rounded border-gray-300 text-green-base focus:ring-green-base"
        />
        <p>{props.content.name}</p>
        <Show when={props.displayQuantity}>
          <div class="ml-4">
            {QuantityUtils.remainingGradeQuantity(props.content.id)} élèves
            restants
          </div>
        </Show>
      </div>
    </Show>
  );
}
