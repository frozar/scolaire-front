import L, { LatLng } from "leaflet";
import {
  TripMetricType,
  TripPointType,
  TripType,
} from "../_entities/trip.entity";
import { WaypointType } from "../_entities/waypoint.entity";
import { MetricsUtils } from "../utils/metrics.utils";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;
const osrmRoute = osrm + "/route/v1/car";
const osrmTable = osrm + "/table/v1/driving";

export type osrmResponseType = {
  routes: routesType[];
  waypoints: {
    name: string;
    distance: number;
    hint: string;
    locations: number[];
  }[];
};

type osrmTableResponseType = {
  durations: number[][];
};

export class OsrmService {
  static async getRoadPolyline(trip: TripType): Promise<{
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: TripMetricType;
    legsDurations: number[];
    legsDistances: number[];
  }> {
    const points: TripPointType[] = trip.tripPoints;
    let waypoints: WaypointType[] = trip.waypoints ?? points;
    waypoints = waypoints.length > 0 ? waypoints : points;
    if (waypoints.length <= 1) {
      return {
        latlngs: [],
        projectedLatlngs: [],
        metrics: {},
        legsDurations: [],
        legsDistances: [],
      };
    }
    const response = await ServiceUtils.generic(
      osrmRoute +
        "/" +
        this.buildPositionURL(waypoints) +
        "?geometries=geojson&overview=full&steps=true"
    );
    const response_direct = await ServiceUtils.generic(
      osrmRoute +
        "/" +
        this.buildPositionURL([points[0], points[points.length - 1]]) +
        "?geometries=geojson&overview=full"
    );

    if (!response)
      return {
        latlngs: [],
        projectedLatlngs: [],
        metrics: {},
        legsDurations: [],
        legsDistances: [],
      };
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

  private static buildTableURL(latlngs: LatLng[]): string {
    return latlngs.map((latlng) => latlng.lng + "," + latlng.lat).join(";");
  }

  static async getHlpMatrix(latlngs: LatLng[]): Promise<number[][]> {
    const response: osrmTableResponseType = await ServiceUtils.generic(
      osrmTable + "/" + this.buildTableURL(latlngs)
    );
    return response["durations"];
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
    legsDurations: number[];
    legsDistances: number[];
  } {
    let latlngs: L.LatLng[] = [];
    let projectedLatlngs: L.LatLng[] = [];
    let metrics: TripMetricType = {};
    if (!response || response.routes[0] == undefined)
      return {
        latlngs,
        projectedLatlngs,
        metrics,
        legsDurations: [],
        legsDistances: [],
      };

    const routes = response.routes;
    const legsDurations = routes[0].legs.map((item) => item.duration);
    const legsDistances = routes[0].legs.map((item) => item.distance);

    const coordinates = routes[0].geometry.coordinates;

    latlngs = coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));

    projectedLatlngs = waypoints.map((waypoint) =>
      L.latLng(waypoint.location[1], waypoint.location[0])
    );

    metrics = MetricsUtils.getAll(response, response_direct, points);

    return { latlngs, projectedLatlngs, metrics, legsDurations, legsDistances };
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
