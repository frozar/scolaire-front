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
          <div class="me-4">
            {props.pointsResource.nature === NatureEnum.stop
              ? "+ " + stopQuantity(props.pointsResource, props.getter)
              : "- " + props.pointsResource.id * -1}
          </div>
          <strong>{props.pointsResource.name}</strong>
          <div class="me-4">
            {props.pointsResource.nature === NatureEnum.stop
              ? " + " + stopSumQuantity(props.getter, props.indice)
              : " - " + props.pointsResource.id * -1}
          </div>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div
          class={
            timelineCircleClass +
            (props.pointsResource.nature == NatureEnum.stop
              ? " !bg-red-500"
              : " !bg-green-base")
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
function stopQuantity(
  pointsResource: LeafletStopType | LeafletSchoolType,
  getter: () => LineUnderConstructionType
) {
  return pointsResource.associated.filter((school) =>
    getter()
      .etablissementSelected.map((point) => point.id)
      .includes(school.id)
  )[0].quantity;
}

function stopSumQuantity(
  getter: () => LineUnderConstructionType,
  indice: number
) {
  let subList = getter().stops.slice(0, indice + 1);

  const school = getter().etablissementSelected[0];
  let deb = subList.lastIndexOf(school);

  deb = deb > -1 ? deb + 1 : 0;

  subList = subList.slice(deb);

  let sum = 0;

  subList.map((point) => {
    sum += stopQuantity(point, getter);
  });

  return sum;
}
