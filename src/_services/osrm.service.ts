import L from "leaflet";
import { PolylinePointType } from "../_entities/bus-line.entity";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

export class OsrmService {
  // static async getRoadPolyline(
  //   points: BusLinePointType[]
  // ): Promise<L.LatLng[]> {
  //   const response = await ServiceUtils.generic(
  //     osrm +
  //       "/" +
  //       this.buildPositionURL(points) +
  //       "?geometries=geojson&overview=full&steps=true"
  //   );

  //   if (!response) return [];
  //   return this.formatResponse(response.routes);
  // }
  static async getRoadPolyline(
    points: PolylinePointType[]
  ): Promise<[L.LatLng[], L.LatLng[]]> {
    const response = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL(points) +
        "?geometries=geojson&overview=full&steps=true"
    );

    if (!response) return [[], []];
    return this.formatResponse(response.routes, response.waypoints);
    // ! return tuple with points projections values
  }

  // private static buildPositionURL(points: BusLinePointType[]): string {
  //   return points.map((point) => point.lon + "," + point.lat).join(";");
  // }

  private static buildPositionURL(points: PolylinePointType[]): string {
    return points.map((point) => point.lon + "," + point.lat).join(";");
  }

  // private static formatResponse(routes: routesType[]): L.LatLng[] {
  //   if (routes[0] == undefined) return [];
  //   const coordinates = routes[0].geometry.coordinates;
  //   return coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));
  // }
  private static formatResponse(
    routes: routesType[],
    waypoints: waypointsType[]
  ): [L.LatLng[], L.LatLng[]] {
    if (routes[0] == undefined) return [[], []];
    const coordinates = routes[0].geometry.coordinates;
    return [
      coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0])),
      waypoints.map((waypoint) =>
        L.latLng(waypoint.location[1], waypoint.location[0])
      ),
    ];
  }
}

type waypointsType = {
  hint: string;
  distance: number;
  name: string;
  location: number[];
};

type routesType = {
  distance: number;
  duration: number;
  geometry: {
    coordinates: number[][];
    type: string;
  };
};
