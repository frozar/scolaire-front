import { JSXElement, Show, createSignal, onMount } from "solid-js";

import { TripType } from "../../../../_entities/trip.entity";
import { addNewGlobalWarningInformation } from "../../../../signaux";
import { ServiceTripsUtils } from "../../../../utils/serviceTrips.utils";
import { TripTimeline } from "../../board/component/organism/TripTimeline";
import { getLines } from "../../map/component/organism/BusLines";
import { ServiceTripCardLeft } from "../atom/ServiceTripCardLeft";
import { ServiceTripCardMiddle } from "../atom/ServiceTripCardMiddle";
import { ServiceTripCardRight } from "../atom/ServiceTripCardRight";
import { DraggableTripType } from "../organism/ServiceLeftBoardContent";
import { setServices } from "../organism/Services";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceTripCard.css";
import { ServiceTripCardDetails } from "./ServiceTripCardDetails";

interface ServiceTripCardProps {
  draggableTrip: DraggableTripType;
}

export function ServiceTripCard(props: ServiceTripCardProps): JSXElement {
  const [isInfoOpen, setIsInfoOpen] = createSignal(false);
  const [currentTrip, setCurrentTrip] = createSignal<TripType>({} as TripType);

  onMount(() => {
    getLines().flatMap((line) =>
      line.trips.map((item) => {
        if (item.id == props.draggableTrip.tripId) {
          setCurrentTrip(item);
        }
      })
    );
  });

  return (
    <div class="service-trip-card-container">
      <div
        class="service-trip-card"
        onDblClick={() => onDblClick(props.draggableTrip.tripId)}
        onClick={() => setIsInfoOpen(!isInfoOpen())}
      >
        <ServiceTripCardLeft trip={props.draggableTrip} />
        <ServiceTripCardMiddle />
        <ServiceTripCardRight trip={props.draggableTrip} />
      </div>
      <Show when={isInfoOpen()}>
        <ServiceTripCardDetails trip={currentTrip()} />
        <TripTimeline inDraw={false} trip={currentTrip()} />
      </Show>
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

    const tripIds = service.serviceTrips.map(
      (serviceTrip) => serviceTrip.tripId
    );
    tripIds.push(tripId);

    const serviceTrips = ServiceTripsUtils.getUpdatedService(
      service,
      tripIds,
      true
    );

    for (const _service of services) {
      if (_service.id == selectedService()) {
        _service.serviceTrips = serviceTrips;
      }
    }
    return services;
  });
}
