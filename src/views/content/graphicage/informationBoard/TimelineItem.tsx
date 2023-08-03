import { Show } from "solid-js";
import {
  AbstractLineType,
  LineType,
  LineUnderConstructionType,
} from "../../../../type";
import { PointInterface } from "../component/atom/Point";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import { TimelineRemovePointButton } from "../component/atom/TimelineRemovePointButton";
export type TimelineItemType = {
  pointsResource: PointInterface;
  indice: number;
  line: AbstractLineType | undefined;
  getter: () => LineUnderConstructionType | LineType;
  setter: (line: LineUnderConstructionType) => void;
  isInAddLineMode: boolean;
};

export function TimelineItem(props: TimelineItemType) {
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <strong>{props.pointsResource.name}</strong>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />

        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small">
          <div class="v-timeline-divider__inner-dot bg-pink">
            <i class="" aria-hidden="true" />
            <Show when={props.isInAddLineMode}>
              <TimelineRemovePointButton {...props} />
            </Show>
          </div>
        </div>

        <div class="v-timeline-divider__after" />
        <Show when={props.isInAddLineMode}>
          <TimelineAddPointButton {...props} />
        </Show>
      </div>
    </div>
  );
}
