import { JSXElement, Show, children, mergeProps } from "solid-js";
import "./TableColumn.css";

interface TableBldyRowColumnProps {
  children: JSXElement;
  class?: string;
  classVariant?: "table-head-col" | "table-head-col-checkbox";
}

export default function (props: TableBldyRowColumnProps) {
  const child = children(() => props.children);

  const mergedProps = mergeProps(
    {
      // eslint-disable-next-line solid/reactivity
      class: `${props.class ?? ""} ${props.classVariant}`,
    },
    props
  );

  return (
    <Show
      when={
        mergedProps.classVariant == "table-head-col" ||
        mergedProps.classVariant == "table-head-col-checkbox"
      }
      fallback={<td class="table-body-col">{child()}</td>}
    >
      <th scope="col" class={`table-head-col ${mergedProps.class}`}>
        {child()}
      </th>
    </Show>
  );
}
