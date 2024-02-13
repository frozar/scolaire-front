import { JSXElement } from "solid-js";

import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceTripCardLeft } from "../atom/ServiceTripCardLeft";
import { ServiceTripCardMiddle } from "../atom/ServiceTripCardMiddle";
import { ServiceTripCardRight } from "../atom/ServiceTripCardRight";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import { setServices } from "../organism/Services";
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
  // TODO: Put in busService.addTrip()
  setServices((prev) => {
    const services = [...prev];

    return ServiceGridUtils.addTrip(services, tripId);
  });
}
