import L from "leaflet";
import {
  TripMetricType,
  TripPointType,
  TripType,
} from "../_entities/trip.entity";
import { WaypointType } from "../_entities/waypoint.entity";
import { NatureEnum } from "../type";
import { GradeUtils } from "../utils/grade.utils";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

type osrmResponseType = { routes: routesType[] };

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
  points: TripPointType[]
) {
  const distance = response.routes[0].distance;

  const duration = response.routes[0].duration;

  const distanceDirect = response_direct.routes[0].distance;

  const deviation = distance / distanceDirect - 1;

  const kmPassager = getKmPassagers(response, points);

  const txRemplissMoy = kmPassager / (distance / 1000);
  return { distance, duration, deviation, kmPassager, txRemplissMoy };
}

function getKmPassagers(
  response: osrmResponseType,
  tripPoints: TripPointType[]
) {
  let kmPassager = 0;

  const schoolIds = tripPoints
    .filter((tripPoint) => tripPoint.nature == NatureEnum.school)
    .map((tripPoint) => tripPoint.id);
  let destinationSchoolIds = schoolIds;

  // Compute remaining distances per school destination
  const remainingDistances: { [schoolId: number]: number } = {};
  response.routes[0].legs.map((elem, k) => {
    destinationSchoolIds.forEach((destination) =>
      k == 0
        ? (remainingDistances[destination] = elem.distance)
        : (remainingDistances[destination] += elem.distance)
    );
    // If school destination reached, removed from destinationSchoolIds
    if (tripPoints.at(k + 1)?.nature == NatureEnum.school) {
      destinationSchoolIds = destinationSchoolIds.filter(
        (destination) => destination != tripPoints.at(k + 1)?.id
      );
    }
  });

  response.routes[0].legs.map((elem, k) => {
    const grades = tripPoints.at(k)?.grades;

    // Update kmPassager
    grades?.forEach((grade) => {
      kmPassager +=
        grade.quantity *
        remainingDistances[GradeUtils.getSchoolId(grade.gradeId)];
    });

    // Update remaining distances
    for (const key of Object.keys(remainingDistances)) {
      remainingDistances[Number(key)] -= elem.distance;
    }
  });

  return kmPassager / 1000;
}
