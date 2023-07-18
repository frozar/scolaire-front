import { JSXElement, children } from "solid-js";
import "./TableBody.css";

interface TableBodyProps {
  children: JSXElement;
}

export default function (props: TableBodyProps) {
  const child = children(() => props.children);
  return <tbody> {child()} </tbody>;
}
