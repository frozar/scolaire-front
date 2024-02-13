import { JSXElement, children } from "solid-js";

import "./TableRow.css";

export function TableRow(props: { children: JSXElement; active?: boolean }) {
  const child = children(() => props.children);
  return (
    <tr class="table-row" classList={{ active: props.active ?? false }}>
      {child()}
    </tr>
  );
}
