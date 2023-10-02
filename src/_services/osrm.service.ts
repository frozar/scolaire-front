import L from "leaflet";
import {
  BusCoursePointType,
  BusCourseType,
  WaypointType,
  busCourseMetricType,
} from "../_entities/bus-course.entity";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

type osrmResponseType = { routes: routesType[] };

export class OsrmService {
  static async getRoadPolyline(busCourse: BusCourseType): Promise<{
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: busCourseMetricType;
  }> {
    const points: BusCoursePointType[] = busCourse.points;
    let waypoints: WaypointType[] = busCourse.waypoints ?? points;
    waypoints = waypoints.length > 0 ? waypoints : points;
    console.log("test osrm ", busCourse);
    if (waypoints.length <= 1) {
      console.log("waypoints.length <= 1");
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
    points: BusCoursePointType[],
    waypoints: waypointsType[]
  ): {
    latlngs: L.LatLng[];
    projectedLatlngs: L.LatLng[];
    metrics: busCourseMetricType;
  } {
    let latlngs: L.LatLng[] = [];
    let projectedLatlngs: L.LatLng[] = [];
    let metrics: busCourseMetricType = {};
    if (!response || response.routes[0] == undefined)
      return { latlngs, projectedLatlngs, metrics };

    const routes = response.routes;

    const coordinates = routes[0].geometry.coordinates;

    latlngs = coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));

    projectedLatlngs = waypoints.map((waypoint) =>
      L.latLng(waypoint.location[1], waypoint.location[0])
    );

    metrics = getMetrics(response, response_direct, points);

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

function getMetrics(
  response: osrmResponseType,
  response_direct: osrmResponseType,
  points: BusCoursePointType[]
) {
  const distance = response.routes[0].distance;

  const duration = response.routes[0].duration;

  const distanceDirect = response_direct.routes[0].distance;

  const deviation = distance / distanceDirect - 1;

  const kmPassager = getKmPassagers(response, points, distance);

  const txRemplissMoy = kmPassager / (distance / 1000);
  return { distance, duration, deviation, kmPassager, txRemplissMoy };
}

function getKmPassagers(
  response: osrmResponseType,
  points: BusCoursePointType[],
  distance: number
) {
  let kmPassager = 0;
  let distance_restante = distance;
  response.routes[0].legs.map((elem, k) => {
    kmPassager += (points.at(k)?.quantity ?? 0) * (distance_restante ?? 0);
    distance_restante -= elem.distance;
  });
  kmPassager = kmPassager / 1000;
  return kmPassager;
}
