import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";

// TODO: Verify number / string right type
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
  route_short_name: number;
  route_long_name: string;
  route_type: number;
  shape_id: string;
  service_window_id: string;
  frequency: number;
  direction: number;
};

type MetaDataType = {
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
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
    ];
  }

  function getMetaData(): MetaDataType[] {
    return [
      {
        agency_name: "flaxib",
        agency_url: "https://flaxib.re",
        agency_timezone: "Indian/Reunion",
        start_date: "20200101",
        end_date: "20201231",
        speed_route_type_3: 20,
        speed_route_type_7: 30,
      },
    ];
  }

  function formatFrequencies(shapes: ShapeElementType): FrequencyType[] {
    /*
    Partant du principe que :

    route_short_name correspond à tripId
    shape_id correspond à String(tripId)

    */
    const frequencies: FrequencyType[] = [];

    for (const shapeKey of Object.keys(shapes)) {
      frequencies.push({
        route_short_name: Number(shapeKey),
        route_long_name: `${shapeKey} route`,
        route_type: 3,
        shape_id: shapeKey,
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
    Partant du principe que :
    
    {
	    id: {
		    shape_id: number,
		    coords: number[]
	    }
    }
    
    id et shape_id correspond à tripId
    coords correspond aux trip.latlngs

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
        // ! ------------------
        zone_id: "",
        parent_station: "",
        stop_desc: "",
        location_type: 0,
      };
    });

    getSchools().forEach((school) => {
      test.push({
        stop_lat: school.lat,
        stop_lon: school.lon,
        stop_id: school.id,
        stop_name: school.name,
        stop_code: school.id,
        // ! ------------------
        zone_id: "",
        parent_station: "",
        stop_desc: "",
        location_type: 0,
      });
    });

    return test;
  }
}
