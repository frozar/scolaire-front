import { JSXElement } from "solid-js";
import { TripUtils } from "../../../../utils/trip.utils";

import { GradeEntity } from "../../../../_entities/grade.entity";
import { zoom } from "../organism/ServiceGrid";
import { ServiceTripType } from "../organism/Services";
import "./ServiceGridItem.css";

interface ServiceGridItemProps {
  serviceTrip: ServiceTripType;
  i: number;
}

export function ServiceGridItem(props: ServiceGridItemProps): JSXElement {
  function tripWidth(): string {
    return (
      Math.round(
        ((TripUtils.get(props.serviceTrip.tripId).metrics?.duration as number) /
          60) *
          zoom()
      ) + "px"
    );
  }

  function hlpWidth(): string {
    // ! Temporary value of 10 minutes used
    return String(5 * zoom()) + "px";
  }

  // TODO: Put in utils
  function startHour(): string {
    if (props.i == 0) {
      const endHour = props.serviceTrip.endHour;

      const duration = Math.round(
        (TripUtils.get(props.serviceTrip.tripId).metrics?.duration as number) /
          60
      );

      const startHour = endHour - duration;

      const hour = Math.trunc(startHour / 60);
      const minutes = startHour % 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
      // TODO
    } else return "--:--";
  }
  // TODO: Put in utils
  function endHour(): string {
    if (props.i == 0) {
      const hour = Math.round(props.serviceTrip.endHour / 60);
      const minutes = (props.serviceTrip.endHour % 60) * 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
      // TODO
    } else return "--:--";
  }

  // TODO: Make itemTrip, itemHlp and itemHalt components
  return (
    <div class="service-grid-item">
      <div class="service-grid-item-trip" style={{ width: tripWidth() }}>
        <div class="service-grid-item-trip-name">
          {TripUtils.get(props.serviceTrip.tripId).name}
        </div>
        <div class="absolute text-xs -rotate-45 -bottom-6 -left-4">
          {startHour()}
        </div>
        <div class="absolute text-xs -rotate-45 -bottom-6 -right-4">
          {endHour()}
        </div>
      </div>
      <div class="service-grid-item-hlp" style={{ width: hlpWidth() }} />
    </div>
  );
}
