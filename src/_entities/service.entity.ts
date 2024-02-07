import {
  ServiceTripType,
  ServiceType,
} from "../views/content/service/organism/Services";

type ServiceTripsDBType = {
  trip_id: number;
  hlp: number;
  end_hour: number;
};

export type ServiceDBType = {
  id: number;
  name: string;
  service_group_id: number;
  service_trips: ServiceTripsDBType[];
};

export namespace ServiceEntity {
  function buildServiceTrip(
    dbServiceTrips: ServiceTripsDBType[]
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
}
