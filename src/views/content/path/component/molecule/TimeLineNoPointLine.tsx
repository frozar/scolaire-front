import { Show } from "solid-js";
import { setCurrentTripIndex } from "../../../board/component/organism/DrawTripBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { LeftTimeLineContent } from "../atom/LeftTimeLineContent";
import { RightTimeLineContent } from "./RightTimeLineContent";
import { TimeLineAction } from "./TimeLineAction";

interface TimeLineNoPointLineProps {
  index: number;
}

export function TimeLineNoPointLine(props: TimeLineNoPointLineProps) {
  return (
    <Show when={onBoard() == "path-draw" && props.index == 0}>
      <LeftTimeLineContent text="" />
      <div class="path-timeline-line">
        <TimeLineAction
          onClick={() => setCurrentTripIndex(0)}
          text="Sélectionnez un point sur la carte"
        />
      </div>
      <RightTimeLineContent countToGet="" name="" totalCount="" />
    </Show>
  );
}
