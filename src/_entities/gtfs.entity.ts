import { TripUtils } from "../utils/trip.utils";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "./trip-direction.entity";

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

export type CalendarDatesType = {
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
  calendar_dates: CalendarDatesType[];
};

export type GtfsDataType = {
  agency: AgencyDataType;
  stops: GtfsStopType[];
  routes: GtfsRouteType[];
};

type GtfsRouteType = {
  route_id: number;
  route_long_name: string;
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

export namespace GtfsEntity {
  // export function formatData(): MgDataType {
  //   const shapes = formatShapes();
  //   const frequencies = formatFrequencies(shapes);
  //   const { serviceWindows, calendarDates } =
  //     GtfsUtils.getServiceWindowsAndCalendarDates();

  //   return {
  //     stops: formatStops(),
  //     shapes,
  //     frequencies,
  //     meta: getMetaData(),
  //     service_windows: serviceWindows,
  //     calendar_dates: calendarDates,
  //   };
  // }
  export function formatData(): GtfsDataType {
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
    };
  }

  // TODO: Use the correct transit agency information
  // function getMetaData(): MetaType[] {
  //   return [
  //     {
  //       agency_id: "AGENCE",
  //       agency_name: "AGENCE",
  //       agency_url: "https://agence.re",
  //       agency_timezone: "Indian/Reunion",
  //       agency_lang: "fr",
  //       agency_phone: "",
  //       agency_fare_url: "",
  //       agency_email: "",
  //       start_date: "20200101",
  //       end_date: "20201231",
  //     },
  //   ];
  // }
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
  // TODO: Use real data for service_window_id, frequency, direction
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function formatFrequencies(shapes: ShapeType): FrequencyType[] {
    const frequencies: FrequencyType[] = [];

    for (const tripId of Object.keys(shapes)) {
      const line = TripUtils.getLine(Number(tripId));
      frequencies.push({
        route_short_name: line.id as number,
        route_long_name: line.name as string,
        route_type: 3,
        shape_id: tripId,
        service_window_id: "weekday_peak_1",
        frequency: 1,
        // direction: 0,
        // ! Direction ne correspond pas à aller / retour mais dans le sens de la shape ou non !
        // ! Donc si diff shape pour aller/retour direction sera toujours 1
        direction:
          TripDirectionEntity.FindDirectionById(
            TripUtils.get(Number(tripId)).tripDirectionId
          ).type == TripDirectionEnum.going
            ? 0
            : 1,
      });
    }

    return frequencies;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function formatShapes(): ShapeType {
    const shapes: ShapeType = {};
    const trips = getLines().flatMap((line) => line.trips);

    trips.forEach((trip) => {
      const tripId = trip.id as number;
      shapes[tripId] = { shape_id: tripId, coords: [] };

      trip.latLngs.forEach((latLng) => {
        shapes[tripId]["coords"].push([latLng.lat, latLng.lng]);
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
