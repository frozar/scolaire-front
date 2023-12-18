import { Setter, Show, createEffect, createSignal, on } from "solid-js";

import { range } from "lodash";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import { TripPointType, TripType } from "../../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../../type";
import { TripUtils } from "../../../../../utils/trip.utils";
import { TripTimelineRemovePointButton } from "./TripTimelineRemovePointButton";

import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../../_entities/trip-direction.entity";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
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
      setQuantity(
        QuantityUtils.SumQuantity(props.trip.tripPoints, props.indice)
      );
    } else {
      setQuantity(
        QuantityUtils.DropQuantity(
          props.trip.tripPoints,
          props.indice,
          setQuantity
        )
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
    else
      return (
        QuantityUtils.SumQuantity(props.trip.tripPoints, props.indice - 1) * -1
      );
  }

  function getTotalDropped(points: TripPointType[], indice: number) {
    let total = 0;
    points.every((item, index) => {
      if (index < indice) {
        total += item.grades.reduce(
          (total, grade) => total + grade.quantity,
          0
        );
        return true;
      } else return false;
    });
    return total;
  }

  function getToDropQuantity() {
    const points = TripUtils.getSplitedTripPointsAtFirstSchoolPosition(
      props.trip.tripPoints
    );
    const tripTotalQuantity = QuantityUtils.getTripTotalQuantities(points);
    const indice = points.findIndex(
      (item) => item.id == props.trip.tripPoints[props.indice].id
    );
    let bufferTotal = tripTotalQuantity - getTotalDropped(points, indice);

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
      if (
        !QuantityUtils.haveSchoolBefore(props.trip.tripPoints, props.indice)
      ) {
        if (props.tripPoint.nature == NatureEnum.school) {
          const slicedTripPoint =
            TripUtils.getSplitedTripPointsAtFirstSchoolPosition(
              props.trip.tripPoints
            );
          return "+" + QuantityUtils.getTripTotalQuantities(slicedTripPoint);
        }
        return "--";
      }

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
