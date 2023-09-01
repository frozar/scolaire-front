import L from "leaflet";
import {
  BusLinePointType,
  busLineMetricType,
} from "../_entities/bus-line.entity";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

export class OsrmService {
  static async getRoadPolyline(
    points: BusLinePointType[]
  ): Promise<{ latlngs: L.LatLng[]; metrics: busLineMetricType }> {
    const response = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL(points) +
        "?geometries=geojson&overview=full"
    );

    if (!response) return { latlngs: [], metrics: {} };

    const distanceParcourue = response.routes[0].distance;

    const metrics: busLineMetricType = {
      distance: distanceParcourue,
    };

    return { latlngs: this.formatResponse(response.routes), metrics };
  }

  private static buildPositionURL(points: BusLinePointType[]): string {
    return points.map((point) => point.lon + "," + point.lat).join(";");
  }

  private static formatResponse(routes: routesType[]): L.LatLng[] {
    if (routes[0] == undefined) return [];
    const coordinates = routes[0].geometry.coordinates;
    return coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));
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
