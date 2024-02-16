import _ from "lodash";
import { JSXElement, createEffect, createSignal, on, onMount } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { TripUtils } from "../../../../utils/trip.utils";
import { ServiceGridButtons } from "../molecule/ServiceGridButtons";
import { selectedService } from "../template/ServiceTemplate";
import "./Service.css";

export type ServiceType = {
  id: number;
  name: string;
  serviceGroupId: number;
  // TODO: replace serviceTrips with tripIds: number[]
  serviceTrips: ServiceTripType[];
  serviceTripsOrdered: ServiceTripOrderedType[];
};

// TODO: merge with
export type ServiceTripType = {
  tripId: number;
  hlp: number; // in minutes
  endHour: number; // in minutes
};

export type ServiceTripOrderedType = {
  tripId: number;
  hlp: number; // in minutes
  endHour: number; // in minutes
  waitingTime: number; // in minutes
};

export const [services, setServices] = createSignal<ServiceType[]>([]);
export const [servicesBeforeModification, setServicesBeforeModification] =
  createSignal<ServiceType[]>([]);

export const [refScroll, setRefScroll] = createSignal<HTMLDivElement>(
  document.createElement("div")
);

export function Services(): JSXElement {
  createEffect(
    on(services, () => {
      const selectedServiceId = selectedService();
      if (!selectedServiceId) return;

      ServiceGridUtils.scrollToServiceStart(
        refScroll(),
        selectedServiceId,
        true
      );
    })
  );

  // TODO: Déplacer vers serviceGrid.tsx
  createEffect(() => {
    /* React on services() and hlpMatrix() */

    const _services = _.cloneDeep(services());

    const serviceTripIds = _services
      .flatMap((service) => service.serviceTrips)
      .map((serviceTrip) => serviceTrip.tripId)
      .sort((a, b) => a - b);

    const serviceTripOrderedIds = _services
      .flatMap((service) => service.serviceTripsOrdered)
      .map((serviceTrip) => serviceTrip.tripId)
      .sort((a, b) => a - b);

    // Avoiding infinite loop
    if (!_.isEqual(serviceTripIds, serviceTripOrderedIds)) {
      for (const service of _services) {
        service.serviceTripsOrdered = [];

        for (const serviceTripIndex of [
          ...Array(service.serviceTrips.length).keys(),
        ]) {
          const tripId = service.serviceTrips[serviceTripIndex].tripId;
          const tripDuration = ServiceGridUtils.getTripWidth(tripId);
          const tripDirection = TripDirectionEntity.FindDirectionById(
            TripUtils.get(tripId).tripDirectionId
          ).type;
          const minTimeOfTimeRange =
            ServiceGridUtils.getEarliestArrival(tripId);

          // Case 1 : First serviceTrip
          if (serviceTripIndex == 0) {
            service.serviceTripsOrdered.push({
              tripId: tripId,
              hlp: 0,
              endHour:
                tripDirection == TripDirectionEnum.going
                  ? minTimeOfTimeRange
                  : minTimeOfTimeRange + tripDuration,
              waitingTime: 0,
            });
            continue;
          }
          /*
          Computation for hlp, earliestEndHour, earliestDepartureHour uses 
          the last serviceTrips of serviceTripsOrdered as the previous serviceTrip
          */
          const hlp = ServiceGridUtils.getHlpDuration(
            service.serviceTrips,
            service.serviceTripsOrdered,
            serviceTripIndex
          );

          const maxTimeOfTimeRange = ServiceGridUtils.getLatestArrival(tripId);

          const earliestEndHour =
            (service.serviceTripsOrdered.at(-1) as ServiceTripType).endHour +
            hlp +
            tripDuration;

          const earliestDepartureHour =
            (service.serviceTripsOrdered.at(-1) as ServiceTripType).endHour +
            hlp;

          // Case 2 : Earliest arrival or departure in the time range
          function case2ConditionComing(): boolean {
            return (
              // ! Aller
              tripDirection == TripDirectionEnum.going &&
              minTimeOfTimeRange <= earliestEndHour &&
              earliestEndHour <= maxTimeOfTimeRange
            );
          }

          function case2ConditionGoing(): boolean {
            return (
              // ! Retour
              tripDirection == TripDirectionEnum.coming &&
              minTimeOfTimeRange <= earliestDepartureHour &&
              earliestDepartureHour <= maxTimeOfTimeRange
            );
          }

          if (case2ConditionComing() || case2ConditionGoing()) {
            service.serviceTripsOrdered.push({
              tripId,
              hlp,
              endHour: earliestEndHour,
              waitingTime: 0,
            });
          }

          // Case 3 : Earliest arrival or departure before time range
          function case3ConditionComing(): boolean {
            return (
              // ! Aller
              tripDirection == TripDirectionEnum.going &&
              earliestEndHour < minTimeOfTimeRange
            );
          }

          function case3ConditionGoing(): boolean {
            return (
              // ! Retour
              tripDirection == TripDirectionEnum.coming &&
              earliestDepartureHour < minTimeOfTimeRange
            );
          }

          if (case3ConditionComing() || case3ConditionGoing()) {
            const waitingTime =
              tripDirection == TripDirectionEnum.going
                ? minTimeOfTimeRange - earliestEndHour
                : minTimeOfTimeRange - earliestDepartureHour;

            service.serviceTripsOrdered.push({
              tripId,
              hlp,
              endHour: earliestEndHour + waitingTime,
              waitingTime,
            });
          }

          // Case 4 : Earliest arrival or departure after time range
        }
        console.log("service", service);
      }
      // * Save in services()
    }
  });

  onMount(() => {
    setServicesBeforeModification(_.cloneDeep(services()));

    const firstServiceId = services()[0].id;
    ServiceGridUtils.scrollToServiceStart(refScroll(), firstServiceId, false);
  });

  return (
    <div id="services">
      <ServiceGridButtons />

      <div id="services-displayed" ref={setRefScroll}>
        <ServiceList />
        <ServiceGrid />
      </div>
    </div>
  );
}
