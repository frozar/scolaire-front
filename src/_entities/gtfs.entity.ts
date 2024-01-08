import { NatureEnum } from "../type";
import { GtfsUtils } from "../utils/gtfs.utils";
import { TripUtils } from "../utils/trip.utils";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "./trip-direction.entity";
import { TripPointType, TripType } from "./trip.entity";

// Precise GTFS files field definitions :
// https://gtfs.org/en/schedule/reference/#field-definitions

// Make_gtfs docs:
// https://mrcagney.github.io/make_gtfs_docs/

type StopMgType = {
  stop_lat: number;
  zone_id: string;
  stop_lon: number;
  stop_id: string;
  stop_code: string;
  parent_station: string;
  stop_name: string;
  stop_desc: string;
  location_type: number;
};

type ShapeType = {
  [id: number]: {
    shape_id: number;
    coords: [number, number][];
  };
};

type FrequencyType = {
  // "route" represent a line
  route_short_name: number; // => line.id (mg library use that to create route_id)
  route_long_name: string;
  route_type: 3; // 3 = bus line
  // shape represent an ordered list of latLngs
  shape_id: string; // may be way.id
  service_window_id: string;
  frequency: number; // TODO: Specify what it is
  direction: number; // onward or return
};

type MetaType = {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string;
  agency_fare_url: string;
  agency_email: string;
  // dates when datas is valid
  start_date: string;
  end_date: string;
};

// ServiceWindows is used to create calendar.txt
export type ServiceWindowType = {
  service_window_id: string;
  start_time: string; // start time of the service
  end_time: string; // end time of the service
  start_date: string;
  end_date: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
};

export type GtfsCalendarDatesType = {
  service_id: number;
  date: string;
  exception_type: number;
};

export type MgDataType = {
  stops: StopMgType[];
  shapes: ShapeType;
  frequencies: FrequencyType[];
  meta: MetaType[];
  service_windows: ServiceWindowType[];
  calendar_dates: GtfsCalendarDatesType[];
};

export type GtfsDataType = {
  agency: AgencyDataType;
  stops: GtfsStopType[];
  routes: GtfsRouteType[];
  calendars: GtfsCalendarType[];
  calendar_dates: GtfsCalendarDatesType[];
  shapes: ShapeType;
  trips: GtfsTripType[];
  trip_mapping_calendar: GtfsTripMappingCalendarType;
  stop_times: GtfsStopTimesType;
};
export type GtfsTripMappingCalendarType = { [tripId: number]: number };

type GtfsStopTimesType = {
  trip_ids: number[];
  arrival_times: string[];
  departure_times: string[];
  stop_ids: string[];
  stop_sequences: number[];
  shape_dist_traveled: number[];
  pickup_types: number[];
  drop_off_types: number[];
};
type GtfsTripType = {
  route_id: number;
  trip_id: number;
  trip_name: string;
  direction: number;
};

type GtfsRouteType = {
  route_id: number;
  route_long_name: string;
};

export type GtfsCalendarType = {
  id: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
  start_date: string;
  end_date: string;
};

type GtfsStopType = {
  stop_lat: number;
  stop_lon: number;
  stop_id: string;
  stop_name: string;
};

type AgencyDataType = {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string;
  agency_fare_url: string;
  agency_email: string;
};

// TODO: Use real agency informations
export namespace GtfsEntity {
  export function formatData(): GtfsDataType {
    const { calendars, calendarDates, tripIdMappingCalendarId } =
      GtfsUtils.getServiceWindowsAndCalendarDates();
    return {
      agency: {
        agency_id: "AGENCE",
        agency_name: "AGENCE",
        agency_url: "https://agence.re",
        agency_timezone: "Indian/Reunion",
        agency_lang: "fr",
        agency_phone: "",
        agency_fare_url: "",
        agency_email: "",
      },
      stops: formatStops(),
      routes: formatRoutes(),
      calendars,
      calendar_dates: calendarDates,
      shapes: formatShapes(),
      trips: formatTrips(),
      trip_mapping_calendar: tripIdMappingCalendarId,
      stop_times: formatStopTimes(),
    };
  }

  function getDropOffAndPickupValues(
    trip: TripType,
    tripPoint: TripPointType
  ): { drop_off_type: number; pickup_type: number } {
    let drop_off_type: number;
    let pickup_type: number;

    switch (TripDirectionEntity.FindDirectionById(trip.tripDirectionId).type) {
      case TripDirectionEnum.going:
        if (tripPoint.nature == NatureEnum.school) {
          drop_off_type = 0;
          pickup_type = 1;
        } else {
          drop_off_type = 1;
          pickup_type = 0;
        }
        break;

      case TripDirectionEnum.coming:
        if (tripPoint.nature == NatureEnum.school) {
          drop_off_type = 1;
          pickup_type = 0;
        } else {
          drop_off_type = 0;
          pickup_type = 1;
        }
        break;

      default:
        drop_off_type = 0;
        pickup_type = 0;
        break;
    }

    return { drop_off_type, pickup_type };
  }

  function formatStopTimes(): GtfsStopTimesType {
    const trip_ids: number[] = [];
    const arrival_times: string[] = [];
    const departure_times: string[] = [];
    const stop_ids: string[] = [];
    const stop_sequences: number[] = [];
    const shape_dist_traveled: number[] = [];
    const drop_off_types: number[] = [];
    const pickup_types: number[] = [];

    const trips = TripUtils.getAll();
    for (const trip of trips) {
      let indice = -1;
      for (const tripPoint of trip.tripPoints) {
        indice += 1;
        trip_ids.push(trip.id as number);

        stop_ids.push(
          tripPoint.id + (tripPoint.nature == NatureEnum.school ? "-sc" : "-st")
        );

        const timeOfPassage = TripUtils.getTimePassage(indice, trip, tripPoint);

        arrival_times.push(timeOfPassage);
        departure_times.push(timeOfPassage);

        stop_sequences.push(indice + 1);

        shape_dist_traveled.push(tripPoint.startToTripPointDistance);

        const { drop_off_type, pickup_type } = getDropOffAndPickupValues(
          trip,
          tripPoint
        );

        drop_off_types.push(drop_off_type);
        pickup_types.push(pickup_type);
      }
    }
    return {
      trip_ids,
      arrival_times,
      departure_times,
      stop_ids,
      stop_sequences,
      shape_dist_traveled,
      drop_off_types,
      pickup_types,
    };
  }

  function formatTrips(): GtfsTripType[] {
    const gtfsTrips: GtfsTripType[] = [];
    const trips = TripUtils.getAll();

    trips.forEach((trip) => {
      const directionEnum = TripDirectionEntity.FindDirectionById(
        trip.tripDirectionId
      ).type;
      gtfsTrips.push({
        route_id: TripUtils.getLine(trip.id as number).id as number,
        trip_id: trip.id as number,
        trip_name: trip.name,
        direction: directionEnum == TripDirectionEnum.going ? 0 : 1,
      });
    });

    return gtfsTrips;
  }

  function formatRoutes(): GtfsRouteType[] {
    const routes: GtfsRouteType[] = [];
    const tripIds = getLines()
      .flatMap((line) => line.trips)
      .map((trip) => trip.id as number);

    for (const tripId of tripIds) {
      const line = TripUtils.getLine(Number(tripId));

      if (!routes.map((route) => route.route_id).includes(line.id as number)) {
        routes.push({
          route_id: line.id as number,
          route_long_name: line.name as string,
        });
      }
    }

    return routes;
  }

  // TODO: Update when Way is added to the app (don't use trip_id as shape_id)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function formatShapes(): ShapeType {
    const shapes: ShapeType = {};
    const trips = getLines().flatMap((line) => line.trips);

    trips.forEach((trip) => {
      const tripId = trip.id as number;
      shapes[tripId] = { shape_id: tripId, coords: [] };

      trip.latLngs.forEach((latLng) => {
        shapes[tripId]["coords"].push([latLng.lng, latLng.lat]);
      });
    });

    return shapes;
  }

  function formatStops(): GtfsStopType[] {
    const stops: GtfsStopType[] = getStops().map((stop) => {
      return {
        stop_lat: stop.lat,
        stop_lon: stop.lon,
        stop_id: stop.id + "-st",
        stop_name: stop.name,
      };
    });

    getSchools().forEach((school) => {
      stops.push({
        stop_lat: school.lat,
        stop_lon: school.lon,
        stop_id: school.id + "-sc",
        stop_name: school.name,
      });
    });

    return stops;
  }
}
