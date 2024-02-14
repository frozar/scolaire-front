import { JSXElement, Show, children } from "solid-js";

import "./TableRow.css";

export function TableRow(props: {
  children: JSXElement;
  active?: boolean;
  hidden?: boolean;
}) {
  const child = children(() => props.children);
  return (
    <Show when={!props.hidden}>
      <tr class="table-row" classList={{ active: props.active ?? false }}>
        {child()}
      </tr>
    </Show>
  );
}
