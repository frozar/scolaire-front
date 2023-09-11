import { Show } from "solid-js";

import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { NatureEnum } from "../../../../../type";
import { onBoard } from "../template/ContextManager";
import { TimelineRemovePointButton } from "./TimelineRemovePointButton";

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();

export type TimelineItemAddType = {
  pointsResource: BusLinePointType;
  indice: number;
  busLine: BusLineType;
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
              ? "+ " + props.pointsResource.quantity
              : " " +
                SumQuantity(
                  props.busLine.points,
                  props.busLine.schools[0],
                  props.indice - 1
                ) *
                  -1}
          </div>
          <strong>{props.pointsResource.name}</strong>
          <div class="ms-4">
            {props.pointsResource.nature === NatureEnum.stop
              ? " + " +
                SumQuantity(
                  props.busLine.points,
                  props.busLine.schools[0],
                  props.indice
                )
              : " " +
                SumQuantity(
                  props.busLine.points,
                  props.busLine.schools[0],
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
            <Show when={onBoard() == "draw-line"}>
              <TimelineRemovePointButton
                indice={props.indice}
                setter={setLineUnderConstruction}
                getter={getLineUnderConstruction}
              />
            </Show>
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
