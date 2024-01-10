import { JSXElement, Setter } from "solid-js";
import "./ButtonIcon.css";

export interface ButtonIconProps {
  icon: JSXElement;
  onClick: () => void;
  class?: string;
  svgClass?: string;
  refSetter?: Setter<HTMLButtonElement>;
  disable?: boolean;
}

export default function (props: ButtonIconProps) {
  return (
    <button
      ref={props.refSetter}
      class={
        "btn-icon " + props.class + (props.disable == true ? " opacity-20" : "")
      }
      onClick={() =>
        props.disable == true
          ? console.log("Fonctionnalité désactivée")
          : props.onClick()
      }
    >
      {props.icon}
    </button>
  );
}
