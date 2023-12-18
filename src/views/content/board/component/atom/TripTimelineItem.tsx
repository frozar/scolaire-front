import { Show, createEffect } from "solid-js";

import { NatureEnum } from "../../../../../type";
import { TripTimelineRemovePointButton } from "./TripTimelineRemovePointButton";

import {
  DrawTripStep,
  currentStep,
  displayTripMode,
  displayTripModeEnum,
} from "../organism/DrawTripBoard";
import "./TripTimelineItem.css";

interface TripTimelineItemProps {
  pointName: string;
  pointNature: NatureEnum;
  quantityToGetOrDrop: string;
  calculatedQuantity: number;
  timePassage: string;
  tripColor: string;
  onClickRemovePointFromTrip: () => void;
}

export function TripTimelineItem(props: TripTimelineItemProps) {
  const pointColor =
    // eslint-disable-next-line solid/reactivity
    props.pointNature == NatureEnum.stop ? " !bg-dark-teal" : " !bg-red-base";

  createEffect(() => setDividerColor(props.tripColor));

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="first-items">
            <div class="me-4">{props.quantityToGetOrDrop}</div>
            <p class="resource-name">{props.pointName}</p>
          </div>
          <div class="ms-4">{props.calculatedQuantity}</div>
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
            <Show when={currentStep() == DrawTripStep.editTrip}>
              <TripTimelineRemovePointButton
                onClick={props.onClickRemovePointFromTrip}
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
        <p class="time-passage">{props.timePassage}</p>
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
