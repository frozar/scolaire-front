import { JSXElement, Show } from "solid-js";
import TrashIcon from "../../../../icons/TrashIcon";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { TripUtils } from "../../../../utils/trip.utils";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { ServiceTripType, setServices } from "../organism/Services";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridTripItem.css";

interface ServiceGridTripItemProps {
  serviceTrip: ServiceTripType;
  serviceId: number;
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
      <div class="service-grid-item-trip-start-hour">
        {ServiceGridUtils.getServiceTripStartHour(props.i, props.serviceTrip)}
      </div>
      <div class="service-grid-item-trip-end-hour">
        {ServiceGridUtils.getServiceEndHour(props.i, props.serviceTrip)}
      </div>
      <Show when={selectedService() == props.serviceId}>
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => removeTripFromService(props.serviceTrip.tripId)}
          class="service-grid-item-trip-trash-button"
        />
      </Show>
    </div>
  );
}
