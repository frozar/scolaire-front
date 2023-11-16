import { getLines } from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";

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

export namespace GtfsEntity {
  export function formatData() {
    const stops = formatStops();
    console.log("stops =>", stops);

    const shapes = formatShapes();
    console.log("shapes =>", shapes);
  }

  // ! Shapes correspond aux trips ?
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
    // ! stop_code ? stop_desc ?
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
