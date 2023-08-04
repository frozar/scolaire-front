import { LineUnderConstructionType } from "../../../../type";
import { PointInterface } from "../component/atom/Point";
import { TimelineRemovePointButton } from "../component/atom/TimelineRemovePointButton";
export type TimelineItemAddType = {
  pointsResource: PointInterface;
  indice: number;
  getter: () => LineUnderConstructionType;
  setter: (line: LineUnderConstructionType) => void;
  isInAddLineMode: boolean;
};

export default function (props: TimelineItemAddType) {
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
            <TimelineRemovePointButton
              indice={props.indice}
              setter={props.setter}
              getter={props.getter}
            />
          </div>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}
