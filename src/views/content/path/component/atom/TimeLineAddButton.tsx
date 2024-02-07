import { FaSolidPlus } from "solid-icons/fa";
import { Setter } from "solid-js";

import "./TimeLineAddButton.css";

interface TimeLineAddButtonProps {
  refSetter: Setter<HTMLElement>;
  onClick: () => void;
}

export function TimeLineAddButton(props: TimeLineAddButtonProps) {
  return (
    <button
      ref={props.refSetter}
      class="timeline-add-button"
      onClick={() => props.onClick()}
    >
      <FaSolidPlus />
    </button>
  );
}
