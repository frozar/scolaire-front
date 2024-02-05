import L, { LatLng } from "leaflet";
import { useStateGui } from "../StateGui";
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

type osrmTableResponseType = {
  durations: number[][];
};
export type step = { flaxib_way_id: number; flaxib_weight: number };

export class OsrmService {
  static async getRoadPolyline(trip: TripType): Promise<{
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: TripMetricType;
    legsDurations: number[];
    legsDistances: number[];
    stepsWeight: step[];
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
        stepsWeight: [],
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
        stepsWeight: [],
      };
    return this.formatResponse(
      response,
      response_direct,
      points,
      response.waypoints
    );
  }

  static async setWeight(steps: step[]): Promise<any> {
    const responses = await ServiceUtils.generic(
      host + "/osrm/weight?map_id=" + getActiveMapId(), //TODO
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
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
    stepsWeight: step[];
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
        stepsWeight: [],
      };

    const routes = response.routes;
    const legsDurations = routes[0].legs.map((item) => item.duration);
    const legsDistances = routes[0].legs.map((item) => item.distance);
    const stepsWeight = routes[0].legs.flatMap((leg) => {
      return leg.steps.flatMap((step) => {
        return {
          flaxib_way_id: step.flaxib_way_id,
          flaxib_weight: step.flaxib_weight,
        };
      });
    });
    console.log("legsWeight", stepsWeight);
    console.log("legsWeight", routes[0]);

    const coordinates = routes[0].geometry.coordinates;

    latlngs = coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));

    projectedLatlngs = waypoints.map((waypoint) =>
      L.latLng(waypoint.location[1], waypoint.location[0])
    );

    metrics = MetricsUtils.getAll(response, response_direct, points);

    return {
      latlngs,
      projectedLatlngs,
      metrics,
      legsDurations,
      legsDistances,
      stepsWeight,
    };
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
  legs: { weight: number; duration: number; distance: number; steps: step[] }[];
};
