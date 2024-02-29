import { JSXElement } from "solid-js";

import { addNewGlobalWarningInformation } from "../../../../signaux";
import { ServiceTripOrderedUtils } from "../../../../utils/serviceTripOrdered.utils";
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
    addNewGlobalWarningInformation("Veuillez d'abord sélectionner un service");
    return;
  }

  setServices((prev) => {
    const services = [...prev];
    const service = services.filter(
      (service) => service.id == selectedService()
    )[0];

    const tripIds = service.serviceTripsOrdered.map(
      (serviceTrip) => serviceTrip.tripId
    );
    tripIds.push(tripId);

    const serviceTrips = ServiceTripOrderedUtils.getUpdatedService(
      service,
      tripIds,
      true
    );

    for (const _service of services) {
      if (_service.id == selectedService()) {
        _service.serviceTripsOrdered = serviceTrips;
      }
    }
    return services;
  });
}
