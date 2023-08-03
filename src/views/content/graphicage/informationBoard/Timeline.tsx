import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import {
  AbstractLineType,
  LineType,
  LineUnderConstructionType,
} from "../../../../type";
import { PointInterface } from "../component/atom/Point";
import { mapIdentityToResourceType } from "../line/busLinesUtils";
import { FakeTimelineItem } from "./FakeTimelineItem";
import { TimelineItem } from "./TimelineItem";
const [, { isInAddLineMode }] = useStateAction();
export type TimelineItemType = {
  pointsResource: PointInterface;
  indice: number;
  line: AbstractLineType | undefined;
  getter: () => LineUnderConstructionType | LineType;
  setter: (line: LineUnderConstructionType) => void;
};

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();

export default function (props: { line: () => AbstractLineType }) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={mapIdentityToResourceType(props.line()?.stops)}>
          {/* TODO refactor de replace mapIdentityToResourceType */}
          {(stop, i) => (
            <>
              <Show
                when={
                  isInAddLineMode() &&
                  getLineUnderConstruction().nextIndex == i()
                }
              >
                <FakeTimelineItem />
              </Show>
              <TimelineItem
                pointsResource={stop}
                indice={i()}
                line={props.line()}
                setter={setLineUnderConstruction}
                getter={getLineUnderConstruction}
                isInAddLineMode={isInAddLineMode()}
              />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
