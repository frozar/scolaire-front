import { JSXElement, children } from "solid-js";
import "./TableHeader.css";

export function TableHeader(props: { children: JSXElement }) {
  const child = children(() => props.children);

  return (
    <thead>
      <tr class="table-header">{child()}</tr>
    </thead>
  );
}
