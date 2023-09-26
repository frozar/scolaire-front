import { JSXElement, children } from "solid-js";
import "./CardWrapper.css";

interface CardWrapperProps {
  children: JSXElement;
  class?: string;
  onClick?: () => void;
}

export default function (props: CardWrapperProps) {
  const childs = children(() => props.children);

  function onClick() {
    if (props.onClick != undefined) {
      props.onClick();
    }
  }

  return (
    <section
      class={"card " + (props.class != undefined ? props.class : "")}
      onClick={onClick}
    >
      {childs()}
    </section>
  );
}
