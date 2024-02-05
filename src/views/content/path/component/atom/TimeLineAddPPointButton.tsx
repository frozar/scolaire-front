import { FaSolidPlus } from "solid-icons/fa";
import { JSXElement } from "solid-js";

import "./TimeLineAddPPointButton.css";

interface TimeLineAddPPointButtonProps {
  onClick: () => void;
  text: string;
}

export function TimeLineAddPPointButton(
  props: TimeLineAddPPointButtonProps
): JSXElement {
  return (
    <button class="timeline-add-button" onClick={() => props.onClick()}>
      <FaSolidPlus />
      {props.text}
    </button>
  );
}
