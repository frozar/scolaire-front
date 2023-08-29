import { JSXElement } from "solid-js";
import "./ButtonIcon.css";

export default function (props: {
  icon: JSXElement;
  onClick: () => void;
  class?: string;
}) {
  const Icon = () => props.icon;
  return (
    <button class={"btn-icon " + props.class} onClick={() => props.onClick()}>
      <Icon />
    </button>
  );
}
