import { JSXElement, Show } from "solid-js";
import TrashIcon from "../../../../icons/TrashIcon";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { TripUtils } from "../../../../utils/trip.utils";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { ServiceTripType, services, setServices } from "../organism/Services";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridTripItem.css";

interface ServiceGridTripItemProps {
  serviceTrip: ServiceTripType;
  i: number;
}

export function ServiceGridTripItem(
  props: ServiceGridTripItemProps
): JSXElement {
  function removeTripFromService(tripId: number): void {
    setServices((prev) => {
      const services = [...prev];
      const serviceToChange = services.filter(
        (service) => service.id == selectedService()
      )[0];
      const index = services.indexOf(serviceToChange);
      serviceToChange.serviceTrips = serviceToChange.serviceTrips.filter(
        (serviceTrip) => serviceTrip.tripId != tripId
      );

      services.splice(index, 1, serviceToChange);
      return services;
    });
  }
  return (
    <div
      class="service-grid-item-trip"
      style={{
        width: ServiceGridUtils.getTripWidth(props.serviceTrip.tripId),
      }}
    >
      <div class="service-grid-item-trip-name">
        {TripUtils.get(props.serviceTrip.tripId).name}
      </div>
      <div class="absolute text-xs -rotate-45 -bottom-6 -left-4">
        {ServiceGridUtils.getServiceTripStartHour(props.i, props.serviceTrip)}
      </div>
      <div class="absolute text-xs -rotate-45 -bottom-6 -right-4">
        {ServiceGridUtils.getServiceEndHour(props.i, props.serviceTrip)}
      </div>
      <Show when={selectedService() == services()[props.i].id}>
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => removeTripFromService(props.serviceTrip.tripId)}
          class="absolute bottom-0 right-0"
        />
      </Show>
    </div>
  );
}
