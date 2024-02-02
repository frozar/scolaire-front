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
      console.log("No service selected");
      return;
    }
    // Add trip to a service
    setServices((prev) => {
      const servicesFiltered = [...prev].filter(
        (service) => service.id != selectedService()
      );
      const updatedService = [...prev].filter(
        (service) => service.id == selectedService()
      )[0];
      updatedService.tripsIds.push(props.trip.tripId);
      servicesFiltered.push(updatedService);

      return servicesFiltered;
    });
    // Remove from list signal ? OR list signal is reactive filtered one ?
  }

  return (
    <div class="service-trip-card" onDblClick={onDblClick}>
      <ServiceTripCardLeft trip={props.trip} />
      <ServiceTripCardMiddle />
      <ServiceTripCardRight trip={props.trip} />
    </div>
  );
}
