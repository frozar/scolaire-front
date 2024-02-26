import { JSXElement, Show, children, mergeProps } from "solid-js";

import "./TableRow.css";

interface TableRowProps {
  children: JSXElement;
  active?: boolean;
  shown?: boolean;
  onDBClick?: () => void;
}

export function TableRow(props: TableRowProps) {
  const mergedProps = mergeProps({ shown: true }, props);
  const child = children(() => props.children);
  return (
    <Show when={mergedProps.shown}>
      <tr
        class="table-row"
        classList={{ active: props.active ?? false }}
        // eslint-disable-next-line solid/reactivity
        onDblClick={props.onDBClick}
      >
        {child()}
      </tr>
    </Show>
  );
}
