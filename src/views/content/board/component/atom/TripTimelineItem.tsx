import { Setter, Show, createEffect } from "solid-js";

import { TripPointType, TripType } from "../../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../../type";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { TripTimelineRemovePointButton } from "./TripTimelineRemovePointButton";

export function TripTimelineItem(props: {
  trip: TripType;
  setTrip?: Setter<TripType>;
  tripPoint: TripPointType;
  indice: number;
}) {
  const pointColor =
    // eslint-disable-next-line solid/reactivity
    props.tripPoint.nature == NatureEnum.stop
      ? " !bg-dark-teal"
      : " !bg-red-base";

  createEffect(() => {
    setDividerColor(props.trip.color);
  });

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="first-items">
            <div class="me-4">
              {props.tripPoint.nature === NatureEnum.stop
                ? "+ " +
                  props.tripPoint.grades
                    .map((grade) => grade.quantity)
                    .reduce((a, b) => a + b, 0)
                : " " +
                  SumQuantity(props.trip.tripPoints, props.indice - 1) * -1}
            </div>
            <p class="resource-name">{props.tripPoint.name}</p>
          </div>
          <div class="ms-4">
            {props.tripPoint.nature === NatureEnum.stop
              ? SumQuantity(props.trip.tripPoints, props.indice)
              : SumQuantity(props.trip.tripPoints, props.indice)}
          </div>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div
          class={
            "v-timeline-divider__dot v-timeline-divider__dot--size-small" +
            pointColor
          }
        >
          <div class={"v-timeline-divider__inner-dot " + pointColor}>
            <i class="" aria-hidden="true" />
            {/* TODO merge */}
            <Show when={props.setTrip}>
              <TripTimelineRemovePointButton
                indice={props.indice}
                setTrip={props.setTrip}
                trip={props.trip}
              />
            </Show>
          </div>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}

function setDividerColor(color: string) {
  for (const element of document.getElementsByClassName(
    "v-timeline-divider__before"
  )) {
    element.setAttribute("style", "background:" + color);
  }

  for (const element of document.getElementsByClassName(
    "v-timeline-divider__after"
  )) {
    element.setAttribute("style", "background:" + color);
  }
}

// TODO: Simplify
function SumQuantity(tripPoints: TripPointType[], indice: number) {
  let sum = 0;
  let grades: { gradeId: number; schoolId: number; quantity: number }[] = [];
  for (let i = 0; i < indice + 1; i++) {
    const actualGrades = tripPoints[i].grades.map((grade) => {
      return {
        gradeId: grade.gradeId,
        schoolId: GradeUtils.getSchoolId(grade.gradeId),
        quantity: grade.quantity,
      };
    });
    grades.push(...actualGrades);

    switch (tripPoints[i].nature) {
      case NatureEnum.stop:
        actualGrades.forEach((grade) => (sum += grade.quantity));
        break;
      case NatureEnum.school:
        let quantityToSubstract = 0;
        grades.forEach((grade) => {
          if (GradeUtils.getSchoolId(grade.gradeId) == tripPoints[i].id) {
            quantityToSubstract += grade.quantity;
          }
        });
        grades = grades.filter(
          (grade) => GradeUtils.getSchoolId(grade.gradeId) != tripPoints[i].id
        );
        sum -= quantityToSubstract;
        break;
    }
  }
  return sum;
}
