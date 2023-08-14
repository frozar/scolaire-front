import { BusLinePointType } from "../../../../../_entities/bus-line.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
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
              ? "+ " +
                stopQuantity2(
                  props.pointsResource,
                  props.getter().busLine.schools[0]
                )
              : " " +
                SumQuantity2(
                  props.getter().busLine.points,
                  props.getter().busLine.schools[0],
                  props.indice - 1
                ) *
                  -1}
          </div>
          <strong>{props.pointsResource.name}</strong>
          <div class="ms-4">
            {props.pointsResource.nature === NatureEnum.stop
              ? " + " +
                SumQuantity2(
                  props.getter().busLine.points,
                  props.getter().busLine.schools[0],
                  props.indice
                )
              : " " +
                SumQuantity2(
                  props.getter().busLine.points,
                  props.getter().busLine.schools[0],
                  props.indice
                ) *
                  -1}
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
// export function stopQuantity(
//   pointsResource: LeafletStopType | LeafletSchoolType,
//   etablissementSelected: LeafletSchoolType
// ) {
//   return pointsResource.associated.filter(
//     (school) => school.id === etablissementSelected.id
//   )[0].quantity;
// }

// function SumQuantity(
//   stops: (LeafletStopType | LeafletSchoolType)[],
//   selectedSchool: LeafletSchoolType,
//   indice: number
// ) {
//   let subList = stops.slice(0, indice + 1);

//   let deb = subList.lastIndexOf(selectedSchool);

//   deb = deb > -1 ? deb + 1 : 0;

//   subList = subList.slice(deb);

//   let sum = 0;

//   subList.map((point) => {
//     sum += stopQuantity(point, selectedSchool);
//   });

//   return sum;
// }

function SumQuantity2(
  stops: BusLinePointType[],
  selectedSchool: SchoolType,
  indice: number
) {
  const school = stops.filter(
    (point) =>
      point.id === selectedSchool.id &&
      point.nature === NatureEnum.etablissement
  )[0];

  let subList = stops.slice(0, indice + 1);

  let deb = subList.lastIndexOf(school);

  deb = deb > -1 ? deb + 1 : 0;

  subList = subList.slice(deb);

  let sum = 0;

  subList.map((point) => {
    console.log("point.quantity ", point.quantity);

    sum += point.quantity;
  });

  return sum;
}

export function stopQuantity2(
  pointsResource: LeafletStopType | LeafletSchoolType,
  etablissementSelected: LeafletSchoolType
) {
  return pointsResource.associated.filter(
    (school) => school.id === etablissementSelected.id
  )[0].quantity;
}
