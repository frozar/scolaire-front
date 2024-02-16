import { JSXElement } from "solid-js";

export function ServiceGridWaitingItem(props: { width: string }): JSXElement {
  return (
    <div class="flex items-center">
      <div
        class="h-3 bg-dark-teal rounded-lg"
        style={{
          width: props.width,
        }}
      />
    </div>
  );
}
