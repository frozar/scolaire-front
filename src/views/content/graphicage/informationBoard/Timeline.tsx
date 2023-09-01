import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { BusLineType } from "../../../../_entities/bus-line.entity";
import { onBoard } from "../../../layout/component/organism/ContextManager";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItem from "../component/atom/TimelineItem";
import { getSelectedBusLine } from "../component/organism/BusLines";

const [, { getLineUnderConstruction }] = useStateAction();

export default function () {
  const busLine: () => BusLineType = () =>
    onBoard() == "draw-line"
      ? getLineUnderConstruction().busLine
      : (getSelectedBusLine() as BusLineType);

  return (
    <div class="timeline">
      <div
        class="timeline-items v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={busLine().points}>
          {(stop, i) => (
            <>
              <Show when={onBoard() == "draw-line"}>
                <TimelineAddPointButton indice={i()} />
              </Show>

              <TimelineItem
                pointsResource={stop}
                indice={i()}
                busLine={busLine()}
              />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
