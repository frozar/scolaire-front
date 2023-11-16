import { getStops } from "../views/content/map/component/organism/StopPoints";

type StopElementType = {
  stop_lat: number;
  zone_id: string;
  stop_lon: number;
  stop_id: number;
  parent_station: string;
  stop_name: string;
  stop_desc: string;
  location_type: number;
};

export namespace GtfsEntity {
  export function formatData() {
    const stops = formatStops();
    console.log("stops =>", stops);
  }
  function formatStops(): StopElementType[] {
    // ! school considéré comme stops ?
    // ! stop_code ? stop_desc ?
    const test = getStops().map((stop) => {
      return {
        stop_lat: stop.lat,
        stop_lon: stop.lon,
        stop_id: stop.id,
        stop_name: stop.name,
        // ! ------------------
        stop_code: "", // ! ?
        zone_id: "",
        parent_station: "",
        stop_desc: "",
        location_type: 0,
      } as StopElementType;
    });

    return test;
  }
}
