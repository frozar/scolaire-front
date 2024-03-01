import { JSXElement } from "solid-js";
import "./ServiceGridWaitingItem.css";

export function ServiceGridWaitingItem(props: { width: string }): JSXElement {
  return (
    <div class="service-grid-item-trip-waiting">
      <div
        class="h-3 bg-dark-teal rounded-lg"
        style={{
          width: props.width,
        }}
      />
    </div>
  );
}
