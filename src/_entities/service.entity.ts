import {
  ServiceUpdateDBType,
  ServiceUpdateType,
} from "../_services/service.service";
import {
  ServiceTripOrderedType,
  ServiceType,
} from "../views/content/service/organism/Services";

type ServiceTripDBType = {
  trip_id: number;
  hlp: number;
  end_hour: number;
  start_hour: number;
  waiting_time: number;
};

export type ServiceDBType = {
  id: number;
  name: string;
  service_group_id: number;
  service_trips: ServiceTripDBType[];
};

export namespace ServiceEntity {
  function buildServiceTrip(
    dbServiceTrips: ServiceTripDBType[]
  ): ServiceTripOrderedType[] {
    return dbServiceTrips.map((dbServiceTrip) => {
      return {
        tripId: dbServiceTrip.trip_id,
        hlp: dbServiceTrip.hlp,
        endHour: dbServiceTrip.end_hour,
        startHour: dbServiceTrip.start_hour,
        waitingTime: dbServiceTrip.waiting_time,
      };
    });
  }

  export function build(dbService: ServiceDBType): ServiceType {
    return {
      id: dbService.id,
      name: dbService.name,
      serviceGroupId: dbService.service_group_id,
      serviceTripsOrdered: buildServiceTrip(dbService.service_trips),
    };
  }

  export function dbFormat(service: ServiceType): ServiceDBType {
    return {
      id: service.id,
      name: service.name,
      service_group_id: service.serviceGroupId,
      service_trips: service.serviceTripsOrdered.map((serviceTrip) =>
        dbFormatServiceTrip(serviceTrip)
      ),
    };
  }

  export function dbFormatServiceTrip(
    serviceTrip: ServiceTripOrderedType
  ): ServiceTripDBType {
    return {
      trip_id: serviceTrip.tripId,
      hlp: serviceTrip.hlp,
      end_hour: serviceTrip.endHour,
      start_hour: serviceTrip.startHour,
      waiting_time: serviceTrip.waitingTime,
    };
  }

  export function dbFormatServiceUpdate(
    services: ServiceUpdateType
  ): ServiceUpdateDBType {
    return {
      to_add: services.toAdd.map((service) => dbFormat(service)),
      to_modify: services.toModify.map((service) => dbFormat(service)),
      to_delete: services.toDelete,
    };
  }
}
