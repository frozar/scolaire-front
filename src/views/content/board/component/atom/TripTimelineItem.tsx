import { Setter, Show, createEffect, createSignal, on } from "solid-js";

import { range } from "lodash";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import { TripPointType, TripType } from "../../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../../type";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { TripUtils } from "../../../../../utils/trip.utils";
import { TripTimelineRemovePointButton } from "./TripTimelineRemovePointButton";

import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../../_entities/trip-direction.entity";
import {
  DrawTripStep,
  currentStep,
  displayTripMode,
  displayTripModeEnum,
} from "../organism/DrawTripBoard";
import "./TripTimelineItem.css";

export function TripTimelineItem(props: {
  trip: TripType;
  setTrip?: Setter<TripType>;
  tripPoint: TripPointType;
  indice: number;
}) {
  const [quantity, setQuantity] = createSignal<number>(0);
  const trippoints = () => props.trip.tripPoints;

  createEffect(
    on(trippoints, () => {
      getQuantity();
    })
  );

  const tripDirection = () =>
    TripDirectionEntity.FindDirectionById(props.trip.tripDirectionId);

  const pointColor =
    // eslint-disable-next-line solid/reactivity
    props.tripPoint.nature == NatureEnum.stop
      ? " !bg-dark-teal"
      : " !bg-red-base";

  createEffect(() => {
    setDividerColor(props.trip.color);
  });

  const timePassage = (): string => {
    if (props.indice == 0 || !props.tripPoint.passageTime)
      return GradeEntity.getStringFromHourFormat(props.trip.startTime);

    const firstHour: string = GradeEntity.getStringFromHourFormat(
      props.trip.startTime
    );

    let seconds = 0;
    for (const i in range(props.indice + 1)) {
      seconds += props.trip.tripPoints[i].passageTime ?? 0;
    }
    const hourMinute = TripUtils.convertSecondesToHourMinute(seconds);
    return TripUtils.addHourTogether(firstHour, hourMinute);
  };

  function getQuantity() {
    const append = tripDirection().type == TripDirectionEnum.going;
    if (append) {
      setQuantity(SumQuantity(props.trip.tripPoints, props.indice));
    } else {
      setQuantity(
        DropQuantity(props.trip.tripPoints, props.indice, setQuantity)
      );
    }
  }

  function getToAppendQuantity() {
    if (props.tripPoint.nature === NatureEnum.stop)
      return (
        "+ " +
        props.tripPoint.grades
          .map((grade) => grade.quantity)
          .reduce((total, quantity) => total + quantity, 0)
      );
    else return SumQuantity(props.trip.tripPoints, props.indice - 1) * -1;
  }

  function getToDropQuantity() {
    const tripTotalQuantity = getTripTotalQuantities(props.trip.tripPoints);
    let bufferTotal = tripTotalQuantity - getTotalDropped();

    function getTotalDropped() {
      let total = 0;
      props.trip.tripPoints.every((item, index) => {
        if (index < props.indice) {
          total += item.grades.reduce(
            (total, grade) => total + grade.quantity,
            0
          );
          return true;
        } else return false;
      });
      return total;
    }

    if (props.tripPoint.nature === NatureEnum.stop) {
      const result = bufferTotal - quantity();
      bufferTotal -= result;
      return "- " + result;
    } else return "+ " + tripTotalQuantity;
  }

  // * The left side of timeline
  function getToCalculQuantity() {
    const appendQuantity = tripDirection().type == TripDirectionEnum.going;
    if (appendQuantity) {
      return getToAppendQuantity();
    } else {
      return getToDropQuantity();
    }
  }

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="first-items">
            <div class="me-4">{getToCalculQuantity()}</div>
            <p class="resource-name">{props.tripPoint.name}</p>
          </div>
          <div class="ms-4">{quantity()}</div>
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
      <Show
        when={
          currentStep() == DrawTripStep.initial ||
          displayTripMode() == displayTripModeEnum.onRoad
        }
      >
        <p class="time-passage">{timePassage()}</p>
      </Show>
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
    const gradesOfCurrentPoint = tripPoints[i].grades.map((grade) => {
      return {
        gradeId: grade.gradeId,
        schoolId: GradeUtils.getSchoolId(grade.gradeId),
        quantity: grade.quantity,
      };
    });
    grades.push(...gradesOfCurrentPoint);

    switch (tripPoints[i].nature) {
      case NatureEnum.stop:
        gradesOfCurrentPoint.forEach((grade) => (sum += grade.quantity));
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

function DropQuantity(
  tripPoints: TripPointType[],
  indice: number,
  setQuantity: Setter<number>
) {
  let tripTotalQuantities = getTripTotalQuantities(tripPoints);

  switch (tripPoints[indice].nature) {
    case NatureEnum.school:
      setQuantity(tripTotalQuantities);
      break;
    case NatureEnum.stop:
      const trippoints = [...tripPoints];
      trippoints.every((item, index) => {
        if (index > indice) return false;
        else {
          tripTotalQuantities -= trippoints[index].grades.reduce(
            (total, item) => total + item.quantity,
            0
          );
          setQuantity(tripTotalQuantities);
          return true;
        }
      });
      break;
  }

  return tripTotalQuantities;
}

function getTripTotalQuantities(tripPoints: TripPointType[]) {
  let tripTotalQuantities = 0;

  //* For each stops add each grade quantity to SchoolStartQuantity
  tripPoints.forEach((points) => {
    if (points.nature == NatureEnum.stop)
      tripTotalQuantities += points.grades.reduce(
        (total, item) => total + item.quantity,
        0
      );
  });

  return tripTotalQuantities;
}
