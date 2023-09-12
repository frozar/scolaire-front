import { JSXElement } from "solid-js";
import "./ButtonIcon.css";

export interface ButtonIconProps {
  icon: JSXElement;
  onClick: () => void;
  class?: string;
  svgClass?: string;
}

export default function (props: ButtonIconProps) {
  const Icon = () => props.icon;
  return (
    <button class={"btn-icon " + props.class} onClick={() => props.onClick()}>
      <Icon />
    </button>
  );
}
