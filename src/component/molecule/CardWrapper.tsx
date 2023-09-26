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
  refClickableButtons?: Accessor<HTMLButtonElement | undefined>[];
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
    if (props.refClickableButtons != undefined) {
      for (const ref of props.refClickableButtons) {
        if (ref() != undefined) {
          ref()?.addEventListener("mouseenter", () => {
            toggleHoverClickable();
          });

          ref()?.addEventListener("mouseleave", () => {
            toggleHoverClickable();
          });
        }
      }
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
