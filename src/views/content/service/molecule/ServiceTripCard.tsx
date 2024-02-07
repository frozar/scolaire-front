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
  function onDblClick(): void {
    if (!selectedService()) {
      // TODO: Display user message
      console.log("No service selected");
      return;
    }

    // eslint-disable-next-line solid/reactivity
    setServices((prev) => {
      const services = [...prev];

      return ServiceGridUtils.addTrip(services, props.trip.tripId);
    });
  }

  return (
    <div class="service-trip-card" onDblClick={onDblClick}>
      <ServiceTripCardLeft trip={props.trip} />
      <ServiceTripCardMiddle />
      <ServiceTripCardRight trip={props.trip} />
    </div>
  );
}
