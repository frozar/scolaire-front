import {
  ServiceUpdateDBType,
  ServiceUpdateType,
} from "../_services/service.service";
import {
  ServiceTripType,
  ServiceType,
} from "../views/content/service/organism/Services";

type ServiceTripDBType = {
  trip_id: number;
  hlp: number;
  end_hour: number;
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
  ): ServiceTripType[] {
    return dbServiceTrips.map((serviceTrip) => {
      return {
        tripId: serviceTrip.trip_id,
        hlp: serviceTrip.hlp,
        endHour: serviceTrip.end_hour,
      };
    });
  }

  export function build(dbService: ServiceDBType): ServiceType {
    return {
      id: dbService.id,
      name: dbService.name,
      serviceGroupId: dbService.service_group_id,
      serviceTrips: buildServiceTrip(dbService.service_trips),
    };
  }

  export function dbFormat(service: ServiceType): ServiceDBType {
    return {
      id: service.id,
      name: service.name,
      service_group_id: service.serviceGroupId,
      service_trips: service.serviceTrips.map((serviceTrip) =>
        dbFormatServiceTrip(serviceTrip)
      ),
    };
  }

  export function dbFormatServiceTrip(
    serviceTrip: ServiceTripType
  ): ServiceTripDBType {
    return {
      trip_id: serviceTrip.tripId,
      hlp: serviceTrip.hlp,
      end_hour: serviceTrip.endHour,
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
