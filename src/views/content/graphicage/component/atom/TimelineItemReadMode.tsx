import { BusLinePointType } from "../../../../../_entities/bus-line.entity";
import { NatureEnum } from "../../../../../type";

export type TimelineItemReadType = {
  point: BusLinePointType;
};

export default function (props: TimelineItemReadType) {
  const timelineCircleClass =
    "v-timeline-divider__dot v-timeline-divider__dot--size-small";

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="me-4">
            {props.point.nature == NatureEnum.stop
              ? "+ " + props.point.quantity
              : "- " + props.point.quantity * -1}
          </div>
          <strong>{props.point.name}</strong>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div
          class={
            props.point.nature == NatureEnum.stop
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
