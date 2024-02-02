import { JSXElement } from "solid-js";

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
    // Add trip to a service

    // eslint-disable-next-line solid/reactivity
    setServices((prev) => {
      const services = [...prev];

      const serviceToChange = services.filter(
        (service) => service.id == selectedService()
      )[0];
      const index = services.indexOf(serviceToChange);
      serviceToChange.tripsIds.push(props.trip.tripId);
      services.splice(index, 1, serviceToChange);

      return services;
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
