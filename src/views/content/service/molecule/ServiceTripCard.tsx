import { JSXElement } from "solid-js";

import { BusServiceUtils } from "../../../../utils/busService.utils";
import { ServiceTripCardLeft } from "../atom/ServiceTripCardLeft";
import { ServiceTripCardMiddle } from "../atom/ServiceTripCardMiddle";
import { ServiceTripCardRight } from "../atom/ServiceTripCardRight";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceTripCard.css";

interface ServiceTripCardProps {
  trip: DraggableTripType;
}

export function ServiceTripCard(props: ServiceTripCardProps): JSXElement {
  return (
    <div
      class="service-trip-card"
      onDblClick={() => onDblClick(props.trip.tripId)}
    >
      <ServiceTripCardLeft trip={props.trip} />
      <ServiceTripCardMiddle />
      <ServiceTripCardRight trip={props.trip} />
    </div>
  );
}

function onDblClick(tripId: number): void {
  if (!selectedService()) {
    // TODO: Display user message
    console.log("No service selected");
    return;
  }

  BusServiceUtils.addTrip(tripId, selectedService() as number);
}
