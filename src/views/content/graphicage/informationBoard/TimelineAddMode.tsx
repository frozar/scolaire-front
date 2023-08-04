import { For } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { LineUnderConstructionType } from "../../../../type";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import { mapIdentityToResourceType } from "../line/busLinesUtils";
import TimelineItemAddMode from "./TimelineItemAddMode";
const [, { isInAddLineMode }] = useStateAction();

export default function (props: {
  line: () => LineUnderConstructionType;
  setLine: (line: LineUnderConstructionType) => void;
}) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={mapIdentityToResourceType(props.line()?.stops)}>
          {(stop, i) => (
            <>
              <TimelineAddPointButton
                pointsResource={stop}
                indice={i()}
                setter={props.setLine}
                getter={props.line}
                isInAddLineMode={isInAddLineMode()}
              />

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
  );
}
