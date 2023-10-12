import { For, Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusCourseEntity,
  CourseType,
} from "../../../../../_entities/course.entity";
import { getSelectedCourse } from "../../../map/component/organism/Courses";
import { TimelineAddPointButton } from "../atom/TimelineAddPointButton";
import TimelineItem from "../atom/TimelineItem";
import { onBoard } from "../template/ContextManager";

const [, { getCourseUnderConstruction }] = useStateAction();

export default function () {
  const [displayBusCourse, setDisplayPoints] = createSignal<CourseType>(
    BusCourseEntity.defaultBusCourse()
  );

  createEffect(() => {
    const displayedPoints =
      onBoard() === "race-draw"
        ? getCourseUnderConstruction().course
        : (getSelectedCourse() as CourseType);

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
              <Show when={onBoard() == "race-draw"}>
                <TimelineAddPointButton indice={i()} />
              </Show>

              <Show when={displayBusCourse() != undefined}>
                <TimelineItem
                  pointsResource={stop}
                  indice={i()}
                  course={displayBusCourse()}
                />
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
