import { GradeEntity } from "../_entities/grade.entity";
import { zoom } from "../views/content/service/organism/ServiceGrid";
import {
  ServiceTripType,
  services,
} from "../views/content/service/organism/Services";
import { selectedService } from "../views/content/service/template/ServiceTemplate";
import { TripUtils } from "./trip.utils";

export namespace ServiceGridUtils {
  export function scrollToServiceStart(ref: HTMLDivElement): void {
    const endHour = services().filter(
      (service) => service.id == selectedService()
    )[0].serviceTrips[0].endHour;

    ref.scrollTo((endHour - 25) * zoom(), 0);
  }

  export function getTripWidth(tripId: number): string {
    return (
      Math.round(
        ((TripUtils.get(tripId).metrics?.duration as number) / 60) * zoom()
      ) + "px"
    );
  }

  export function getHlpWidth(): string {
    // TODO: Use real value
    return String(5 * zoom()) + "px";
  }

  export function getServiceTripStartHour(
    i: number,
    serviceTrip: ServiceTripType
  ): string {
    if (i == 0) {
      const endHour = serviceTrip.endHour;

      const duration = Math.round(
        (TripUtils.get(serviceTrip.tripId).metrics?.duration as number) / 60
      );

      const startHour = endHour - duration;

      const hour = Math.trunc(startHour / 60);
      const minutes = startHour % 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
      // TODO
    } else return "--:--";
  }

  export function getServiceEndHour(
    i: number,
    serviceTrip: ServiceTripType
  ): string {
    if (i == 0) {
      const hour = Math.round(serviceTrip.endHour / 60);
      const minutes = (serviceTrip.endHour % 60) * 60;

      return GradeEntity.getStringFromHourFormat({ hour, minutes });
      // TODO
    } else return "--:--";
  }
}
