import { For, Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLineEntity,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { getSelectedBusLine } from "../../../map/component/organism/BusLines";
import { TimelineAddPointButton } from "../atom/TimelineAddPointButton";
import TimelineItem from "../atom/TimelineItem";
import { onBoard } from "../template/ContextManager";

const [, { getLineUnderConstruction }] = useStateAction();

export default function () {
  const [displayBusLine, setDisplayPoints] = createSignal<BusLineType>(
    BusLineEntity.defaultBusLine()
  );

  createEffect(() => {
    const displayedPoints =
      onBoard() === "line-draw"
        ? getLineUnderConstruction().busLine
        : (getSelectedBusLine() as BusLineType);

    setDisplayPoints(displayedPoints);
  });
  return (
    <div class="timeline">
      <div
        class="timeline-items v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={displayBusLine()?.points}>
          {(stop, i) => (
            <>
              <Show when={onBoard() == "line-draw"}>
                <TimelineAddPointButton indice={i()} />
              </Show>

              <Show when={displayBusLine() != undefined}>
                <TimelineItem
                  pointsResource={stop}
                  indice={i()}
                  busLine={displayBusLine()}
                />
              </Show>
            </>
          )}
        </For>
      </div>
    </div>
  );
}
