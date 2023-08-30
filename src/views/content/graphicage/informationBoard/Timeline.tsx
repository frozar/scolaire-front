import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { BusLineType } from "../../../../_entities/bus-line.entity";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItem from "../component/atom/TimelineItem";
import { getSelectedBusLine } from "../component/organism/BusLines";

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();

export default function () {
  const busLine: () => BusLineType = () =>
    isInAddLineMode()
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
              <Show when={isInAddLineMode()}>
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
