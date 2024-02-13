import { JSXElement, children } from "solid-js";

import "./TableDataChilds.css";

export function TableDataChilds(props: { children: JSXElement }) {
  const child = children(() => props.children);
  return <td class="table-data-custom"> {child()} </td>;
}
