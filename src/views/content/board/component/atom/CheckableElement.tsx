import { Show } from "solid-js";

export type CheckableElementType = {
  name: string;
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
      </div>
    </Show>
  );
}
