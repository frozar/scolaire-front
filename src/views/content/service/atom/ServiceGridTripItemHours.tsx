import { JSXElement } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceTripType } from "../organism/Services";
import "./ServiceGridTripItemHours.css";

interface ServiceGridTripItemHoursProps {
  i: number;
  serviceTrip: ServiceTripType;
  serviceId: number;
}

export function ServiceGridTripItemHours(
  props: ServiceGridTripItemHoursProps
): JSXElement {
  return (
    <>
      <div class="service-grid-item-trip-start-hour">
        {ServiceGridUtils.getServiceTripStartHour(
          props.i,
          props.serviceTrip,
          props.serviceId
        )}
      </div>
      <div class="service-grid-item-trip-end-hour">
        {ServiceGridUtils.getServiceEndHour(
          props.i,
          props.serviceTrip,
          props.serviceId
        )}
      </div>
    </>
  );
}
