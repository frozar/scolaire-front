import { JSX } from "solid-js";
import { AbstractLineType, LineUnderConstructionType } from "../../../../type";
import { PointInterface } from "../component/atom/Point";
import { TimelineRemovePointButton } from "../component/atom/TimelineRemovePointButton";
export type TimelineItemType = {
  pointsResource: PointInterface;
  indice: number;
  getter: () => AbstractLineType;
  setter?: (line: LineUnderConstructionType) => void;
  isInAddLineMode: boolean;
  removeButton?: JSX.Element;
};

export function TimelineItem(props: TimelineItemType) {
  const removeButton = <TimelineRemovePointButton {...props} />;
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
            {removeButton}
          </div>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}
