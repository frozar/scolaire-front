import { JSXElement, children } from "solid-js";

import "./TableDataChilds.css";

interface TableDataChildsProps {
  children: JSXElement;
  class?: string;
  end?: boolean;
}

export function TableDataChilds(props: TableDataChildsProps) {
  const child = children(() => props.children);

  return (
    <td class={props.class ?? ""}>
      <div
        class="table-data-child"
        classList={{
          end: props.end ?? false,
        }}
      >
        {child()}
      </div>
    </td>
  );
}
