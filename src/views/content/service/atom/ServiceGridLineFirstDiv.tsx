import { JSXElement, Show } from "solid-js";

interface ServiceGridLineFirstDivProps {
  show: boolean;
  width: string;
}

// TODO: When ServiceGrid fully done, remove border and text content to hide the component
export function ServiceGridLineFirstDiv(
  props: ServiceGridLineFirstDivProps
): JSXElement {
  return (
    <Show when={props.show}>
      <div class="service-grid-line-first-div" style={{ width: props.width }}>
        blank space
      </div>
    </Show>
  );
}
