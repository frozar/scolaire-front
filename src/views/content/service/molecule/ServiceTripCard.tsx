import { JSXElement } from "solid-js";

import { addNewGlobalWarningInformation } from "../../../../signaux";
import { ServiceTripOrderedUtils } from "../../../../utils/serviceTripOrdered.utils";
import { ServiceTripCardLeft } from "../atom/ServiceTripCardLeft";
import { ServiceTripCardMiddle } from "../atom/ServiceTripCardMiddle";
import { ServiceTripCardRight } from "../atom/ServiceTripCardRight";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import { services } from "../organism/Services";
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

  // const service = BusServiceUtils.get(selectedService() as number);
  const _services = [...services()];
  const service = _services.filter(
    (service) => service.id == (selectedService() as number)
  )[0];
  const tripIds = service.serviceTripsOrdered.map(
    (serviceTrip) => serviceTrip.tripId
  );
  tripIds.push(tripId);

  ServiceTripOrderedUtils.addServiceTrip(service, tripIds);

  // setServices(_services);

  // BusServiceUtils.addTrip(tripId, selectedService() as number);
}
