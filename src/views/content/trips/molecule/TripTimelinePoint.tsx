import { JSXElement, children, createEffect, onMount } from "solid-js";
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

  children: JSXElement;
}

export function TripTimelinePoint(props: TripTimelineItemProps) {
  const childs = children(() => props.children);
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
      <div class="timeline-dot">
        <div class={"dot " + pointColor}>{childs()}</div>
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
