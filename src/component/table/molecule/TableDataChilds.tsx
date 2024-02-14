import { JSXElement, children } from "solid-js";

import "./TableDataChilds.css";

interface TableDataChildsProps {
  children: JSXElement;
  end?: boolean;
}

export function TableDataChilds(props: TableDataChildsProps) {
  const child = children(() => props.children);

  return (
    <td>
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
