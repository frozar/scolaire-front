import { For, createEffect, createSignal } from "solid-js";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../_entities/bus-line.entity";
import { PointInterface } from "../component/atom/Point";
import TimelineItemReadMode from "../component/atom/TimelineItemReadMode";
import { LeafletSchoolType } from "../component/organism/SchoolPoints";
import { LeafletStopType } from "../component/organism/StopPoints";

interface itemInfoToDisplayInterface {
  point: PointInterface;
  quantity: number;
}

const [pointsToDisplay, setPointsToDisplay] = createSignal<BusLinePointType[]>(
  []
);

type ExtendedBusLinePointType = {
  entity: LeafletSchoolType | LeafletStopType;
} & BusLinePointType;

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
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={pointsToDisplay()}>
          {(point) => (
            <>
              <TimelineItemReadMode point={point} />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
