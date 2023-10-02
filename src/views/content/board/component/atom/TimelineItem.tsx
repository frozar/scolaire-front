import { Show, createEffect } from "solid-js";

import { useStateAction } from "../../../../../StateAction";
import {
  CoursePointType,
  CourseType,
} from "../../../../../_entities/course.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { NatureEnum } from "../../../../../type";
import { onBoard } from "../template/ContextManager";
import { TimelineRemovePointButton } from "./TimelineRemovePointButton";

const [, { setCourseUnderConstruction, getCourseUnderConstruction }] =
  useStateAction();

export type TimelineItemAddType = {
  pointsResource: CoursePointType;
  indice: number;
  course: CourseType;
};

export default function (props: TimelineItemAddType) {
  const pointColor = () =>
    props.pointsResource.nature == NatureEnum.stop
      ? " !bg-blue-base"
      : " !bg-red-base";

  createEffect(() => {
    for (const element of document.getElementsByClassName(
      "v-timeline-divider__before"
    )) {
      element.setAttribute("style", "background:" + props.course.color());
    }

    for (const element of document.getElementsByClassName(
      "v-timeline-divider__after"
    )) {
      element.setAttribute("style", "background:" + props.course.color());
    }
  });

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="first-items">
            <div class="me-4">
              {props.pointsResource.nature === NatureEnum.stop
                ? "+ " + props.pointsResource.quantity
                : " " +
                  SumQuantity(
                    props.course.points,
                    props.course.schools[0],
                    props.indice - 1
                  ) *
                    -1}
            </div>
            <p class="resource-name">{props.pointsResource.name}</p>
          </div>
          <div class="ms-4">
            {props.pointsResource.nature === NatureEnum.stop
              ? " + " +
                SumQuantity(
                  props.course.points,
                  props.course.schools[0],
                  props.indice
                )
              : " " +
                SumQuantity(
                  props.course.points,
                  props.course.schools[0],
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
            "v-timeline-divider__dot v-timeline-divider__dot--size-small" +
            pointColor()
          }
        >
          <div class={"v-timeline-divider__inner-dot " + pointColor()}>
            <i class="" aria-hidden="true" />
            <Show when={onBoard() == "line-draw"}>
              <TimelineRemovePointButton
                indice={props.indice}
                setter={setCourseUnderConstruction}
                getter={getCourseUnderConstruction}
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
  stops: CoursePointType[],
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
