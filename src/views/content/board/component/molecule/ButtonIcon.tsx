import { JSXElement, Setter } from "solid-js";
import "./ButtonIcon.css";

export interface ButtonIconProps {
  icon: JSXElement;
  onClick: () => void;
  class?: string;
  svgClass?: string;
  refSetter?: Setter<HTMLButtonElement>;
}

export default function (props: ButtonIconProps) {
  const Icon = () => props.icon;
  return (
    <button
      ref={props.refSetter}
      class={"btn-icon " + props.class}
      onClick={() => props.onClick()}
    >
      <Icon />
    </button>
  );
}
