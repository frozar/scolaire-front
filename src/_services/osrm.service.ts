import L from "leaflet";
import { useStateGui } from "../StateGui";
import {
  TripMetricType,
  TripPointType,
  TripType,
} from "../_entities/trip.entity";
import { WaypointType } from "../_entities/waypoint.entity";
import { MetricsUtils } from "../utils/metrics.utils";
import { ServiceUtils } from "./_utils.service";

const host = import.meta.env.VITE_BACK_URL;
const [, { getActiveMapId }] = useStateGui();

export type osrmResponseType = {
  routes: routesType[];
  waypoints: {
    name: string;
    distance: number;
    hint: string;
    locations: number[];
  }[];
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
    const waypointsStringified = this.buildPositionURL(waypoints);

    const timecode = 420;

    const responses = await ServiceUtils.generic(
      host +
        "/osrm/road?map_id=" +
        getActiveMapId() +
        "&timecode=" +
        timecode +
        "&waypoints=" +
        waypointsStringified,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = responses[0];
    const response_direct = responses[1];

    // const directWaypointsStringified = this.buildPositionURL([
    //   points[0],
    //   points[points.length - 1],
    // ]);
    // const response_direct = await ServiceUtils.generic(
    //   host +
    //     "/osrm/osrm_utils?map_id=" +
    //     getActiveMapId() +
    //     "&timecode=" +
    //     timecode +
    //     "&waypoints=" +
    //     directWaypointsStringified,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // const response_direct = await ServiceUtils.generic(
    //   osrm +
    //     "/" +
    //     directWaypointsStringified +
    //     "?geometries=geojson&overview=full"
    // );

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
