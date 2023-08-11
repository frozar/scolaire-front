import { LineUnderConstructionType, NatureEnum } from "../../../../../type";
import { LeafletSchoolType } from "../organism/SchoolPoints";
import { LeafletStopType } from "../organism/StopPoints";
import { TimelineRemovePointButton } from "./TimelineRemovePointButton";
export type TimelineItemAddType = {
  pointsResource: LeafletStopType | LeafletSchoolType;
  indice: number;
  getter: () => LineUnderConstructionType;
  setter: (line: LineUnderConstructionType) => void;
  isInAddLineMode: boolean;
};

export default function (props: TimelineItemAddType) {
  const timelineCircleClass =
    "v-timeline-divider__dot v-timeline-divider__dot--size-small";
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <strong>{props.pointsResource.name}</strong>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div
          class={
            props.pointsResource.nature == NatureEnum.stop
              ? timelineCircleClass + " !bg-red-500"
              : timelineCircleClass + " !bg-green-base"
          }
        >
          <div class="v-timeline-divider__inner-dot !bg-white">
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
