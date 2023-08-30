import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../_entities/bus-line.entity";
import { LineUnderConstructionType } from "../../../../type";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItem from "../component/atom/TimelineItem";
// import TimelineItemAddMode from "../component/atom/TimelineItemAddMode";

const [, { isInAddLineMode }] = useStateAction();
// ! Déplacer `DrawHelperButton` hors de ce fichiers

export default function (props: {
  //TODO pas utile de les passer en paramètre ce sont des signaux
  lineUnderConstruction?: () => LineUnderConstructionType;
  line?: () => BusLineType;
  setLine?: (line: LineUnderConstructionType) => void;
}) {
  let busLinePoints: BusLinePointType[] = [];
  isInAddLineMode()
    ? (busLinePoints = props.lineUnderConstruction()?.busLine.points)
    : (busLinePoints = props.line().points);

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
        {/* <For each={props.lineUnderConstruction()?.busLine.points}> */}
        <For each={busLinePoints}>
          {(stop, i) => (
            <>
              <Show when={isInAddLineMode()}>
                <TimelineAddPointButton indice={i()} />
              </Show>

              <TimelineItem
                pointsResource={stop}
                indice={i()}
                setter={props.setLine}
                getter={props.line}
                isInAddLineMode={isInAddLineMode()}
              />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
