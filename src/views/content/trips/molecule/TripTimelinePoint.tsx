import { createEffect, onMount } from "solid-js";
import { TripPointType } from "../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../type";
import { TripUtils } from "../../../../utils/trip.utils";
import "./TripTimelinePoint.css";

interface TripTimelineItemProps {
  point: TripPointType;
  tripColor: string;
  passageTime: number;
  quantity: string;
  accumulateQuantity: number;
  // quantityToGetOrDrop: string;
  // calculatedQuantity: number;
  // timePassage: string;
  // tripColor: string;
  // waitingTime: number;
  // editMode: boolean;
  // onClickRemovePointFromTrip: () => void;
  // onClickWaitingTime: (value: number) => void;
}

export function TripTimelinePoint(props: TripTimelineItemProps) {
  const pointColor =
    // eslint-disable-next-line solid/reactivity
    props.point.nature == NatureEnum.stop ? " !bg-dark-teal" : " !bg-red-base";
  onMount(() => {
    setDividerColor(props.tripColor);
  });

  createEffect(() => setDividerColor(props.tripColor));

  return (
    <div class="timeline-point">
      <p class="timeline-time">
        {TripUtils.convertSecondesToHourMinute(props.passageTime)}
      </p>
      {/* {props.timePassage} */}
      <div class="timeline-dot">
        <div class={"dot " + pointColor} />
        <div class="timeline-point-divider" />
      </div>
      <section class="content">
        <div class="quantity"> {props.quantity}</div>
        <div class="name">{props.point.name}</div>
        <div class="cumulate-quantity">{props.accumulateQuantity}</div>
      </section>
    </div>
  );
}

function setDividerColor(color: string) {
  for (const element of document.getElementsByClassName(
    "timeline-point-divider"
  )) {
    element.setAttribute("style", "background:" + color);
  }
}
