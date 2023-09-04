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

    return this.formatResponse(response);
  }

  private static buildPositionURL(points: BusLinePointType[]): string {
    return points.map((point) => point.lon + "," + point.lat).join(";");
  }

  private static formatResponse(response: osrmResponseType): {
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

    const distance = response.routes[0].distance;

    metrics = {
      distance,
    };

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
};
