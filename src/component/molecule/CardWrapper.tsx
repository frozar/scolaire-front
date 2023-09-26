import {
  Accessor,
  JSXElement,
  children,
  createEffect,
  createSignal,
} from "solid-js";
import "./CardWrapper.css";

interface CardWrapperProps {
  children: JSXElement;
  class?: string;
  onClick?: () => void;
  refClickableButton?: Accessor<HTMLButtonElement>;
}

export default function (props: CardWrapperProps) {
  const childs = children(() => props.children);
  const [hoverClickable, setHoverClickable] = createSignal(false);
  const toggleHoverClickable = () => setHoverClickable((bool) => !bool);

  function onClick() {
    if (props.onClick != undefined && !hoverClickable()) {
      props.onClick();
    }
  }

  createEffect(() => {
    if (
      props.refClickableButton != undefined &&
      props.refClickableButton() != undefined
    ) {
      props.refClickableButton()?.addEventListener("mouseenter", () => {
        toggleHoverClickable();
      });

      props.refClickableButton()?.addEventListener("mouseleave", () => {
        toggleHoverClickable();
      });
    }
  });

  return (
    <section
      class={"card " + (props.class != undefined ? props.class : "")}
      onClick={onClick}
    >
      {childs()}
    </section>
  );
}
