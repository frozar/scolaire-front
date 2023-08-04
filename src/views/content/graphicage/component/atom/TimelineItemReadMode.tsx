import { AbstractLineType, NatureEnum } from "../../../../../type";
import { PointInterface } from "./Point";
import { TimelineItemAddType } from "./TimelineItemAddMode";

export type TimelineItemReadType = {
  pointsResource: PointInterface;
  quantityToDisplay: number;
  getter: () => AbstractLineType | undefined;
};

export default function (props: TimelineItemAddType) {
  const timelineCircleClass =
    "v-timeline-divider__dot v-timeline-divider__dot--size-small";
  console.log("props.pointsResource", props.pointsResource);

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="me-4">
            {props.pointsResource.nature == NatureEnum.ramassage
              ? // "+ " + props.pointsResource.quantity
                "+ " + props.quantityToDisplay
              : // : "- " + props.pointsResource.quantity}
                "- " + props.quantityToDisplay}
          </div>
          <strong>{props.pointsResource.name}</strong>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />

        {/* <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small"> */}
        <div
          class={
            props.pointsResource.nature == NatureEnum.ramassage
              ? timelineCircleClass + " !bg-red-500"
              : timelineCircleClass + " !bg-green-base"
          }
        >
          <div class="v-timeline-divider__inner-dot !bg-white">
            <i class="" aria-hidden="true" />
          </div>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}
