import { JSXElement, children } from "solid-js";
import "./TableHeader.css";

interface TableHeaderProps {
  children: JSXElement;
}

export default function (props: TableHeaderProps) {
  const child = children(() => props.children);
  return (
    <thead>
      <tr>{child()}</tr>
    </thead>
  );
}
