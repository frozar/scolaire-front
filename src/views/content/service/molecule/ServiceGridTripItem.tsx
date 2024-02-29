import { JSXElement, Show } from "solid-js";
import TrashIcon from "../../../../icons/TrashIcon";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceTripOrderedUtils } from "../../../../utils/serviceTripOrdered.utils";
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
  outsideScheduleRange: boolean;
}

export function ServiceGridTripItem(
  props: ServiceGridTripItemProps
): JSXElement {
  return (
    <div
      class="service-grid-item-trip"
      classList={{ "outside-schedule-range": props.outsideScheduleRange }}
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
          onClick={() =>
            removeTripFromService(props.serviceTrip.tripId, props.serviceId)
          }
          class="service-grid-item-trip-trash-button"
        />
      </Show>
    </div>
  );
}

function removeTripFromService(tripId: number, serviceId: number): void {
  setServices((prev) => {
    const services = [...prev];

    const service = services.filter((_service) => _service.id == serviceId)[0];
    const newTripIds = service.serviceTripsOrdered
      .map((serviceTrip) => serviceTrip.tripId)
      .filter((_tripId) => _tripId != tripId);

    const serviceTrips = ServiceTripOrderedUtils.getUpdatedService(
      service,
      newTripIds,
      false
    );

    for (const _service of services) {
      if (_service.id == serviceId) {
        _service.serviceTripsOrdered = serviceTrips;
      }
    }
    return services;
  });
}
