import { FaRegularTrashCan } from "solid-icons/fa";
import { Show } from "solid-js";
import { NatureEnum } from "../../../../../type";
import { onBoard } from "../../../board/component/template/ContextManager";

import "./TimeLineCircle.css";

interface TimeLineCircleProps {
  pointId: number;
  nature: NatureEnum;
  onClickDelete: (id: number) => void;
}

export function TimeLineCircle(props: TimeLineCircleProps) {
  return (
    <div
      class="path-timeline-circle"
      classList={{
        "!bg-dark-teal": props.nature == NatureEnum.stop,
        "!bg-red-teal": props.nature == NatureEnum.school,
      }}
    >
      <Show when={onBoard() == "path-draw"}>
        <button
          onClick={() => props.onClickDelete(props.pointId)}
          class="timeline-delete-point"
        >
          <FaRegularTrashCan />
        </button>
      </Show>
    </div>
  );
}
