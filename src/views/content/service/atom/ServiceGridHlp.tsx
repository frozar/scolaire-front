import { JSXElement } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceTripType } from "../organism/Services";
import "./ServiceGridHlp.css";

interface ServiceGridHlpProps {
  serviceTripIndex: number;
  serviceTrip: ServiceTripType;
  serviceId: number;
}

export function ServiceGridHlp(props: ServiceGridHlpProps): JSXElement {
  return (
    <div
      class="service-grid-item-hlp"
      style={{
        width: ServiceGridUtils.updateAndGetHlpWidth(
          props.serviceTrip,
          props.serviceId,
          props.serviceTripIndex
        ),
      }}
    />
  );
}
