import { JSXElement, Show } from "solid-js";
import TrashIcon from "../../../../icons/TrashIcon";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { TripUtils } from "../../../../utils/trip.utils";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { ServiceGridItemStartEndStopNames } from "../atom/ServiceGridItemStartEndStopNames";
import { ServiceGridTripItemHours } from "../atom/ServiceGridTripItemHours";
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

      ServiceGridUtils.removeTrip(services, tripId);

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

      <ServiceGridItemStartEndStopNames tripId={props.serviceTrip.tripId} />

      <ServiceGridTripItemHours
        i={props.i}
        serviceTrip={props.serviceTrip}
        serviceId={props.serviceId}
      />

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
