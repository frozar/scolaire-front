import L from "leaflet";
import {
  TripMetricType,
  TripPointType,
  TripType,
} from "../_entities/trip.entity";
import { WaypointType } from "../_entities/waypoint.entity";
import { MetricsUtils } from "../utils/metrics.utils";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

export type osrmResponseType = { routes: routesType[] };

export class OsrmService {
  static async getRoadPolyline(trip: TripType): Promise<{
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: TripMetricType;
  }> {
    const points: TripPointType[] = trip.tripPoints;
    let waypoints: WaypointType[] = trip.waypoints ?? points;
    waypoints = waypoints.length > 0 ? waypoints : points;
    if (waypoints.length <= 1) {
      return { latlngs: [], projectedLatlngs: [], metrics: {} };
    }
    const response = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL(waypoints) +
        "?geometries=geojson&overview=full&steps=true"
    );
    const response_direct = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL([points[0], points[points.length - 1]]) +
        "?geometries=geojson&overview=full"
    );

    if (!response) return { latlngs: [], projectedLatlngs: [], metrics: {} };
    return this.formatResponse(
      response,
      response_direct,
      points,
      response.waypoints
    );
  }

  private static buildPositionURL(points: WaypointType[]): string {
    return points.map((point) => point.lon + "," + point.lat).join(";");
  }

  private static formatResponse(
    response: osrmResponseType,
    response_direct: osrmResponseType,
    points: TripPointType[],
    waypoints: waypointsType[]
  ): {
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: TripMetricType;
  } {
    let latlngs: L.LatLng[] = [];
    let projectedLatlngs: L.LatLng[] = [];
    let metrics: TripMetricType = {};
    if (!response || response.routes[0] == undefined)
      return { latlngs, projectedLatlngs, metrics };

    const routes = response.routes;

    const coordinates = routes[0].geometry.coordinates;

    latlngs = coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));

    projectedLatlngs = waypoints.map((waypoint) =>
      L.latLng(waypoint.location[1], waypoint.location[0])
    );

    metrics = MetricsUtils.getAll(response, response_direct, points);

    return { latlngs, projectedLatlngs, metrics };
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
  legs: { weight: number; duration: number; distance: number }[];
};
