import { JSXElement, children } from "solid-js";
import "./TableCell.css";

interface TableBodyRowProps {
  children?: JSXElement;
}

export default function (props: TableBodyRowProps) {
  const child = children(() => props.children);
  return <td> {child()} </td>;
}
