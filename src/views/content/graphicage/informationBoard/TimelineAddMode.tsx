import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { LineUnderConstructionType } from "../../../../type";
import { DrawHelperButton } from "../component/atom/DrawHelperButton";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import TimelineItemAddMode from "../component/atom/TimelineItemAddMode";

const [, { isInAddLineMode }] = useStateAction();

export default function (props: {
  //TODO pas utile de les passer en paramètre ce sont des signaux
  line: () => LineUnderConstructionType;
  setLine: (line: LineUnderConstructionType) => void;
}) {
  return (
    <>
      <div class="add-line-information-board-content-title">
        <h1>Editer votre ligne</h1>
      </div>
      <div class="timeline">
        <div class="timeline-tools">
          <Show when={props.line().busLine.points.length > 0}>
            <DrawHelperButton schools={props.line().busLine.schools} />
          </Show>
        </div>
        <div
          class="timeline-items v-timeline--side-end v-timeline--vertical"
          style={{ "--v-timeline-line-thickness": "2px" }}
        >
          <For each={props.line()?.busLine.points}>
            {(stop, i) => (
              <>
                <TimelineAddPointButton indice={i()} />

                <TimelineItemAddMode
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
    </>
  );
}
