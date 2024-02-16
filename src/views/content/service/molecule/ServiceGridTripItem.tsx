import { JSXElement, Show } from "solid-js";
import TrashIcon from "../../../../icons/TrashIcon";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { TripUtils } from "../../../../utils/trip.utils";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { ServiceGridItemStartEndStopNames } from "../atom/ServiceGridItemStartEndStopNames";
import { ServiceGridItemTripName } from "../atom/ServiceGridItemTripName";
import { ServiceGridTripItemHours } from "../atom/ServiceGridTripItemHours";
import { ServiceTripOrderedType, setServices } from "../organism/Services";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridTripItem.css";

interface ServiceGridTripItemProps {
  serviceTrip: ServiceTripOrderedType;
  serviceId: number;
  serviceTripIndex: number;
  serviceTripWidth: number;
}

export function ServiceGridTripItem(
  props: ServiceGridTripItemProps
): JSXElement {
  return (
    <div
      class="service-grid-item-trip"
      style={{
        width: ServiceGridUtils.widthCssValue(props.serviceTripWidth),
      }}
    >
      <ServiceGridItemTripName
        name={TripUtils.get(props.serviceTrip.tripId).name}
      />

      <ServiceGridItemStartEndStopNames
        startName={ServiceGridUtils.getStartStopName(props.serviceTrip.tripId)}
        endName={ServiceGridUtils.getEndStopName(props.serviceTrip.tripId)}
      />

      <ServiceGridTripItemHours
        startHour={ServiceGridUtils.getStringHourFormatFromMinutes(
          props.serviceTrip.startHour
        )}
        endHour={ServiceGridUtils.getStringHourFormatFromMinutes(
          props.serviceTrip.endHour
        )}
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

function removeTripFromService(tripId: number): void {
  setServices((prev) => {
    const services = [...prev];

    ServiceGridUtils.removeTrip(services, tripId);

    return services;
  });
}
