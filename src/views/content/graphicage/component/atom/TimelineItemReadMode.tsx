import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { NatureEnum } from "../../../../../type";

// ! use only one input props busline
export type TimelineItemReadType = {
  point: BusLinePointType;
  busLine: () => BusLineType;
  indice: number;
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
              : " " +
                SumQuantity(
                  props.busLine().points,
                  props.busLine().schools[0],
                  props.indice - 1
                ) *
                  -1}
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

function SumQuantity(
  stops: BusLinePointType[],
  selectedSchool: SchoolType,
  indice: number
) {
  const school = stops.filter(
    (point) =>
      point.id === selectedSchool.id && point.nature === NatureEnum.school
  )[0];

  let subList = stops.slice(0, indice + 1);

  let deb = subList.lastIndexOf(school);

  deb = deb > -1 ? deb + 1 : 0;

  subList = subList.slice(deb);

  let sum = 0;

  subList.map((point) => {
    sum += point.quantity;
  });

  return sum;
}
