import {
  AbstractLineType,
  LineType,
  LineUnderConstructionType,
} from "../../../../type";
import { PointInterface } from "../component/atom/Point";
export type TimelineItemType = {
  pointsResource: PointInterface;
  indice: number;
  line: AbstractLineType | undefined;
  getter: () => LineUnderConstructionType | LineType;
  setter: (line: LineUnderConstructionType) => void;
};

export function FakeTimelineItem() {
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <strong>{"Selectionnez un point sur la carte"}</strong>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />

        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small">
          <div class="v-timeline-divider__inner-dot bg-pink">
            <i class="" aria-hidden="true" />
          </div>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}
