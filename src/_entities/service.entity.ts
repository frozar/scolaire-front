import {
  ServiceUpdateDBType,
  ServiceUpdateType,
} from "../_services/service.service";
import {
  ServiceTrip,
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
  flat_graphic_id: number;
};

export namespace ServiceEntity {
  function buildServiceTrip(
    dbServiceTrips: ServiceTripDBType[]
  ): ServiceTrip[] {
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
      flatGraphicId: dbService.flat_graphic_id,
      serviceGroupId: dbService.service_group_id,
      serviceTrips: buildServiceTrip(dbService.service_trips),
    };
  }

  export function dbFormat(service: ServiceType): ServiceDBType {
    return {
      id: service.id,
      name: service.name,
      flat_graphic_id: service.flatGraphicId,
      service_group_id: service.serviceGroupId,
      service_trips: service.serviceTrips.map((serviceTrip) =>
        dbFormatServiceTrip(serviceTrip)
      ),
    };
  }

  export function dbFormatServiceTrip(
    serviceTrip: ServiceTrip
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
