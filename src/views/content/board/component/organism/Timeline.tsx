import { For, Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusCourseEntity,
  BusCourseType,
} from "../../../../../_entities/bus-course.entity";
import { getSelectedBusCourse } from "../../../map/component/organism/BusCourses";
import { TimelineAddPointButton } from "../atom/TimelineAddPointButton";
import TimelineItem from "../atom/TimelineItem";
import { onBoard } from "../template/ContextManager";

const [, { getCourseUnderConstruction }] = useStateAction();

export default function () {
  const [displayBusCourse, setDisplayPoints] = createSignal<BusCourseType>(
    BusCourseEntity.defaultBusCourse()
  );

  createEffect(() => {
    const displayedPoints =
      onBoard() === "line-draw"
        ? getCourseUnderConstruction().busCourse
        : (getSelectedBusCourse() as BusCourseType);

    setDisplayPoints(displayedPoints);
  });
  return (
    <div class="timeline">
      <div
        class="timeline-items "
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={displayBusCourse()?.points}>
          {(stop, i) => (
            <div class="timeline-block">
              <Show when={onBoard() == "line-draw"}>
                <TimelineAddPointButton indice={i()} />
              </Show>

              <Show when={displayBusCourse() != undefined}>
                <TimelineItem
                  pointsResource={stop}
                  indice={i()}
                  busCourse={displayBusCourse()}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
