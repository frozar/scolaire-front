import { For, Show, createEffect } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { BusLineType } from "../../../../_entities/bus-line.entity";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItem from "../component/atom/TimelineItem";
import { getSelectedBusLine } from "../component/organism/BusLines";
// import TimelineItemAddMode from "../component/atom/TimelineItemAddMode";

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();
// ! Déplacer `DrawHelperButton` hors de ce fichiers

export default function () {
  console.log("Timeline component");

  // ! Refactor
  let busLine: () => BusLineType;
  isInAddLineMode()
    ? (busLine = () => getLineUnderConstruction().busLine)
    : (busLine = () => getSelectedBusLine() as BusLineType);

  createEffect(() => {
    isInAddLineMode()
      ? (busLine = () => getLineUnderConstruction().busLine)
      : (busLine = () => getSelectedBusLine() as BusLineType);
    console.log("busLine=>", busLine());
    console.log("busline.points", busLine().points.length);
    console.log("isInAddLineMode", isInAddLineMode());
  });

  return (
    <div class="timeline">
      {/* // ! Put this out of this component (and Update line button) */}
      {/* <div class="timeline-tools">
        <Show when={props.lineUnderConstruction().busLine.points.length > 0}>
          <DrawHelperButton
            schools={props.lineUnderConstruction().busLine.schools}
          />
        </Show>
      </div> */}
      <div
        class="timeline-items v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        {/* <For each={busLine.points}> */}
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
