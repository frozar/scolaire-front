import { JSXElement, children } from "solid-js";
import "./CardWrapper.css";

interface CardWrapperProps {
  children: JSXElement;
  class?: string;
}

export default function (props: CardWrapperProps) {
  const childs = children(() => props.children);

  return <section class={"card " + props.class ?? ""}>{childs()}</section>;
}
