import { Show } from "solid-js";

export type CheckableElementType = {
  name: string;
  checked: boolean;
  indice: number;
  display: boolean;
  onChange: (
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
    indice: number
  ) => void;
};

export function CheckableElement(props: CheckableElementType) {
  return (
    <Show when={props.display}>
      <div class="flex items-center">
        <input
          id="comments"
          name="comments"
          type="checkbox"
          checked={props.checked}
          onChange={(e) => {
            props.onChange(e, props.indice);
          }}
          class="h-4 w-5 mr-4 rounded border-gray-300 text-green-base focus:ring-green-base"
        />
        <p>{props.name}</p>
      </div>
    </Show>
  );
}
