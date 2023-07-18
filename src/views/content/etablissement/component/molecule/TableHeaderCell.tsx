import { JSXElement, children } from "solid-js";
import "./TableHeaderCell.css";

interface TableHeaderProps {
  children: JSXElement;
}

export default function (props: TableHeaderProps) {
  const child = children(() => props.children);
  return <th scope="col"> {child()} </th>;
}
