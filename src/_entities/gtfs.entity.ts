import { GtfsUtils } from "../utils/gtfs.utils";
import { TripUtils } from "../utils/trip.utils";
import { calendarsPeriod } from "../views/content/calendar/template/Calendar";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { CalendarDayEnum } from "./calendar.entity";

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
type ServiceWindowType = {
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

export type MgDataType = {
  stops: StopMgType[];
  shapes: ShapeType;
  frequencies: FrequencyType[];
  meta: MetaType[];
  service_windows: ServiceWindowType[];
};

export namespace GtfsEntity {
  export function formatData(): MgDataType {
    const shapes = formatShapes();
    const frequencies = formatFrequencies(shapes);

    return {
      stops: formatStops(),
      shapes,
      frequencies,
      meta: getMetaData(),
      service_windows: getServiceWindows(),
    };
  }

  function getServiceWindows(): ServiceWindowType[] {
    const trips = TripUtils.getAll();
    const gtfsCalendars: CalendarDayEnum[][] = [];
    const serviceWindows: ServiceWindowType[] = [];

    trips.forEach((trip, i) => {
      if (
        !gtfsCalendars
          .map((_test) => _test.toString())
          .includes(trip.days.toString())
      ) {
        gtfsCalendars.push(trip.days);

        // TODO: What to do if grades has different scolar period ?
        const gradeId = trip.grades[0].id;
        const calendarPeriodId = getSchools()
          .flatMap((school) => school.grades)
          .filter((grade) => grade.id == gradeId)[0].calendar?.calendarPeriodId;
        const period = calendarsPeriod().filter(
          (calendarPeriod) => calendarPeriod.id == calendarPeriodId
        )[0];
        // TODO: Use real values for start_time and end_time ?
        // TODO: Find a way to not use "weekday_peak_" ?
        serviceWindows.push({
          service_window_id: "weekday_peak_" + String(i),
          start_time: "07:00:00",
          end_time: "09:00:00",
          start_date: GtfsUtils.formatDate(period.startDate),
          end_date: GtfsUtils.formatDate(period.endDate),
          monday: trip.days.includes(CalendarDayEnum.monday) ? 1 : 0,
          tuesday: trip.days.includes(CalendarDayEnum.tuesday) ? 1 : 0,
          wednesday: trip.days.includes(CalendarDayEnum.wednesday) ? 1 : 0,
          thursday: trip.days.includes(CalendarDayEnum.thursday) ? 1 : 0,
          friday: trip.days.includes(CalendarDayEnum.friday) ? 1 : 0,
          saturday: trip.days.includes(CalendarDayEnum.saturday) ? 1 : 0,
          sunday: trip.days.includes(CalendarDayEnum.sunday) ? 1 : 0,
        });
      }
    });
    return serviceWindows;
  }

  // TODO: Use the correct transit agency information
  function getMetaData(): MetaType[] {
    return [
      {
        agency_id: "AGENCE",
        agency_name: "AGENCE",
        agency_url: "https://agence.re",
        agency_timezone: "Indian/Reunion",
        agency_lang: "fr",
        agency_phone: "",
        agency_fare_url: "",
        agency_email: "",
        start_date: "20200101",
        end_date: "20201231",
      },
    ];
  }

  // TODO: Use real data for service_window_id, frequency, direction
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
        direction: 0,
      });
    }

    return frequencies;
  }

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

  function formatStops(): StopMgType[] {
    const test: StopMgType[] = getStops().map((stop) => {
      return {
        stop_lat: stop.lat,
        stop_lon: stop.lon,
        stop_id: stop.id + "-st",
        stop_name: stop.name,
        stop_code: "",
        zone_id: "",
        parent_station: "", // Not necessary because location_type = 0
        stop_desc: "",
        location_type: 0,
      };
    });

    getSchools().forEach((school) => {
      test.push({
        stop_lat: school.lat,
        stop_lon: school.lon,
        stop_id: school.id + "-sc",
        stop_name: school.name,
        stop_code: "",
        zone_id: "",
        parent_station: "", // Not necessary because location_type = 0
        stop_desc: "",
        location_type: 0,
      });
    });

    return test;
  }
}
