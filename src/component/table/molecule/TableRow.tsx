import { JSXElement, Show, children, mergeProps } from "solid-js";

import "./TableRow.css";

export function TableRow(props: {
  children: JSXElement;
  active?: boolean;
  shown?: boolean;
}) {
  const mergedProps = mergeProps({ shown: true }, props);
  const child = children(() => props.children);
  return (
    <Show when={mergedProps.shown}>
      <tr class="table-row" classList={{ active: props.active ?? false }}>
        {child()}
      </tr>
    </Show>
  );
}
