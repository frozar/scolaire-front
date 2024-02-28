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

  // TODO: Put in a function and move !
  setServices((prev) => {
    const _services = [...prev];
    const serviceIndex = _services.indexOf(
      _services.filter(
        (service) => service.id == (selectedService() as number)
      )[0]
    );

    const tripIds = _services[serviceIndex].serviceTripsOrdered.map(
      (serviceTrip) => serviceTrip.tripId
    );

    tripIds.push(tripId);

    const serviceTrips = ServiceTripOrderedUtils.getUpdatedService(
      _services[serviceIndex],
      tripIds,
      true
    );

    _services[serviceIndex].serviceTripsOrdered = serviceTrips;

    return _services;
  });
}
