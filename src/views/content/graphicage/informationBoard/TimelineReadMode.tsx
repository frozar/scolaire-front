import { For, createEffect, createSignal } from "solid-js";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../_entities/bus-line.entity";
import TimelineItemReadMode from "../component/atom/TimelineItemReadMode";
import UpdateLineButton from "../component/atom/UpdateLineButton";
import { getSelectedBusLine } from "../component/organism/BusLines";

import "../../../../css/timeline.css";

const [pointsToDisplay, setPointsToDisplay] = createSignal<BusLinePointType[]>(
  []
);

export default function (props: { line: () => BusLineType | undefined }) {
  createEffect(() => {
    const line: BusLineType | undefined = props.line();
    if (!line) {
      return;
    }
    const stops: BusLinePointType[] = line.points;

    setPointsToDisplay(stops);
  });

  return (
    <div class="timeline">
      <div class="timeline-tools">
        <UpdateLineButton busLine={getSelectedBusLine() as BusLineType} />
      </div>
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={pointsToDisplay()}>
          {(point, i) => (
            <>
              <TimelineItemReadMode
                point={point}
                indice={i()}
                busLine={getSelectedBusLine as () => BusLineType}
              />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
