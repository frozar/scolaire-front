import L from "leaflet";
import {
  BusLinePointType,
  busLineMetricType,
} from "../_entities/bus-line.entity";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

type osrmResponseType = { routes: routesType[] };

export class OsrmService {
  static async getRoadPolyline(
    points: BusLinePointType[]
  ): Promise<{ latlngs: L.LatLng[]; metrics: busLineMetricType }> {
    const response: osrmResponseType = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL(points) +
        "?geometries=geojson&overview=full"
    );
    const response_direct = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL([points[0], points[points.length - 1]]) +
        "?geometries=geojson&overview=full"
    );

    return this.formatResponse(response, response_direct, points);
  }

  private static buildPositionURL(points: BusLinePointType[]): string {
    return points.map((point) => point.lon + "," + point.lat).join(";");
  }

  private static formatResponse(
    response: osrmResponseType,
    response_direct: osrmResponseType,
    points: BusLinePointType[]
  ): {
    latlngs: L.LatLng[];
    metrics: busLineMetricType;
  } {
    let latlngs: L.LatLng[] = [];
    let metrics: busLineMetricType = {};

    if (!response || response.routes[0] == undefined)
      return { latlngs, metrics };

    const routes = response.routes;

    const coordinates = routes[0].geometry.coordinates;

    latlngs = coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));

    metrics = getMetrics(response, response_direct, points);

    return { latlngs, metrics };
  }
}

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
  points: BusLinePointType[]
) {
  const distance = response.routes[0].distance;

  const duration = response.routes[0].duration;

  const distanceDirect = response_direct.routes[0].distance;

  const deviation = distance / distanceDirect - 1;

  const kmPassager = getKmPassagers(response, points, distance);

  const txRemplissMoy = kmPassager / distance;
  return { distance, duration, deviation, kmPassager, txRemplissMoy };
}

function getKmPassagers(
  response: osrmResponseType,
  points: BusLinePointType[],
  distance: number
) {
  let kmPassager = 0;
  let distance_restante = distance;
  response.routes[0].legs.map((elem, k) => {
    kmPassager += (points.at(k)?.quantity ?? 0) * (distance_restante ?? 0);
    distance_restante -= elem.distance;
  });

  return kmPassager;
}
