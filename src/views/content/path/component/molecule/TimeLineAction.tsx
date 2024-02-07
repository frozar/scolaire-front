import { JSXElement, Show, createEffect, createSignal, on } from "solid-js";
import { onBoard } from "../../../board/component/template/ContextManager";

import { TimeLineAddButton } from "../atom/TimeLineAddButton";

import "./TimeLineAction.css";

interface TimeLineAddPPointButtonProps {
  onClick: () => void;
  text: string;
}

export function TimeLineAction(
  props: TimeLineAddPPointButtonProps
): JSXElement {
  const [showText, setShowText] = createSignal(false);
  const [ref, setRef] = createSignal<HTMLElement>();

  createEffect(
    on(ref, () => {
      if (ref()) {
        ref()?.addEventListener("focusin", () => setShowText(true));
        ref()?.addEventListener("focusout", () => setShowText(false));
      }
    })
  );

  return (
    <Show when={onBoard() == "path-draw"}>
      <div class="timeline-action">
        <TimeLineAddButton onClick={props.onClick} refSetter={setRef} />
        <Show when={showText()}>
          <p class="timeline-add-text">{props.text}</p>
        </Show>
      </div>
    </Show>
  );
}
