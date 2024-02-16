import { JSXElement } from "solid-js";
import "./ServiceGridTripItemHours.css";

interface ServiceGridTripItemHoursProps {
  startHour: string;
  endHour: string;
}

export function ServiceGridTripItemHours(
  props: ServiceGridTripItemHoursProps
): JSXElement {
  return (
    <>
      <div class="service-grid-item-trip-start-hour">{props.startHour}</div>
      <div class="service-grid-item-trip-end-hour">{props.endHour}</div>
    </>
  );
}
