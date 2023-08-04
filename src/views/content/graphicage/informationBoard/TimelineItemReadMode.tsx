import { AbstractLineType } from "../../../../type";
import { PointInterface } from "../component/atom/Point";
export type TimelineItemAddType = {
  pointsResource: PointInterface;
  getter: () => AbstractLineType | undefined;
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
          </div>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}
