import { TripUtils } from "../utils/trip.utils";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";

// TODO: Verify number / string right type
// TODO: Specify corresponding data to better understand !
type StopElementType = {
  stop_lat: number;
  zone_id: string;
  stop_lon: number;
  stop_id: number;
  stop_code: number;
  parent_station: string;
  stop_name: string;
  stop_desc: string;
  location_type: number;
};

type ShapeElementType = {
  [id: number]: {
    shape_id: number;
    coords: [number, number][];
  };
};

type FrequencyType = {
  // route represent a line !?
  route_short_name: number; // => line id (used by mg library in that way)
  route_long_name: string;
  route_type: 3; // 3 = bus line
  shape_id: string; // => id du chemin, different si aller ou retour !
  service_window_id: string; // TODO: Specify what it is
  frequency: number; // TODO: Specify what it is
  direction: number; // TODO: Specify what it is
};

type MetaDataType = {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang: string;
  agency_phone: string;
  agency_fare_url: string;
  agency_email: string;
  start_date: string;
  end_date: string;
  speed_route_type_3: number;
  speed_route_type_7: number;
};

type ServiceWindowType = {
  service_window_id: string;
  start_time: string;
  end_time: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
};

export type GtfsData = {
  stops: StopElementType[];
  shapes: ShapeElementType;
  frequencies: FrequencyType[];
  meta: MetaDataType[];
  service_windows: ServiceWindowType[];
};

export namespace GtfsEntity {
  export function formatData(): GtfsData {
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

  // TODO: Use real data
  function getServiceWindows(): ServiceWindowType[] {
    return [
      {
        service_window_id: "weekday_peak_1",
        start_time: "07:00:00",
        end_time: "09:00:00",
        monday: 1,
        tuesday: 1,
        wednesday: 1,
        thursday: 1,
        friday: 1,
        saturday: 0,
        sunday: 0,
      },
      {
        service_window_id: "weekend_peak_1",
        start_time: "07:00:00",
        end_time: "09:00:00",
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 1,
        sunday: 1,
      },
    ];
  }

  // TODO: Use the correct transit agency information
  function getMetaData(): MetaDataType[] {
    return [
      {
        agency_id: "FLAXIB",
        agency_name: "FLAXIB",
        agency_url: "https://flaxib.re",
        agency_timezone: "Indian/Reunion",
        agency_lang: "fr",
        agency_phone: "",
        agency_fare_url: "",
        agency_email: "",
        start_date: "20200101",
        end_date: "20201231",
        speed_route_type_3: 20,
        speed_route_type_7: 30,
      },
    ];
  }

  function formatFrequencies(shapes: ShapeElementType): FrequencyType[] {
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

  // ! un des latlongs doit correspondre avec un latlong de stops ???
  function formatShapes(): ShapeElementType {
    /*
    {
	    id: {
		    shape_id: number,
		    coords: number[]
	    }
    }

    */
    const shapes: ShapeElementType = {};
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

  function formatStops(): StopElementType[] {
    // ! school considéré comme stops ? => attention aux ids !!!!!
    const test: StopElementType[] = getStops().map((stop) => {
      return {
        stop_lat: stop.lat,
        stop_lon: stop.lon,
        stop_id: stop.id,
        stop_name: stop.name,
        stop_code: stop.id,
        zone_id: "",
        parent_station: "",
        // ! Si type = 1 donc parent_station doit être vide
        // ! Si type = 0 parent_station doit être l'id du stop
        // !    "parent" etant de type = 1
        stop_desc: "",
        location_type: 0,
        // ! Selon exemple CAR JAUNE
        // ! type 1 => gare
        // ! type 0 => arrêts de bus
        // ! Les écoles sont soit type 1 soit type 0
      };
    });

    getSchools().forEach((school) => {
      test.push({
        stop_lat: school.lat,
        stop_lon: school.lon,
        stop_id: school.id,
        stop_name: school.name,
        stop_code: school.id,
        zone_id: "",
        parent_station: "",
        stop_desc: "",
        location_type: 0,
      });
    });

    return test;
  }
}
