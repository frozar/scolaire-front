import { JSXElement } from "solid-js";
import { BusServiceUtils } from "../../../../utils/busService.utils";
import { zoom } from "../organism/ServiceGrid";
import { ServiceTripType } from "../organism/Services";
import { hlpMatrix } from "../template/ServiceTemplate";
import "./ServiceGridHlp.css";

interface ServiceGridHlpProps {
  i: number;
  serviceTrip: ServiceTripType;
  serviceId: number;
}

export function ServiceGridHlp(props: ServiceGridHlpProps): JSXElement {
  // TODO: Also save value !
  // TODO: Move in utils
  function getHlpWidth(serviceId: number, i: number): string {
    const serviceTrips = BusServiceUtils.get(serviceId).serviceTrips;
    const idPreviousTrip = serviceTrips[i - 1].tripId;
    const idActualTrip = serviceTrips[i].tripId;

    const hlpDuration = hlpMatrix()[idActualTrip][idPreviousTrip];

    return String(Math.round(hlpDuration / 60) * zoom()) + "px";
  }
  return (
    <div
      class="service-grid-item-hlp"
      style={{ width: getHlpWidth(props.serviceId, props.i) }}
    />
  );
}
