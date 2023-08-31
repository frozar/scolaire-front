import L from "leaflet";
import { BusLinePointType } from "../_entities/bus-line.entity";
import { ServiceUtils } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

export class OsrmService {
  static async getRoadPolyline(
    points: BusLinePointType[]
  ): Promise<L.LatLng[]> {
    const response = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL(points) +
        "?geometries=geojson&overview=full"
    );

    if (!response) return [];
    const Dp = response.routes[0].distance;
    console.log(response);
    console.log("-distance parcouru (m)", Dp);

    const response_direct = await ServiceUtils.generic(
      osrm +
        "/" +
        this.buildPositionURL([points[0], points[points.length - 1]]) +
        "?geometries=geojson&overview=full"
    );

    const Dd = response_direct.routes[0].distance;
    console.log("distance direct (m)", Dd);
    // console.log("duration direct (s)", response_direct.routes[0].duration);

    console.log("-degré de déviation (s)", Dp / Dd - 1);
    console.log("-temps de parcourts (s)", response.routes[0].duration);
    let res = 0;
    let distance_restante = Dp;
    response.routes[0].legs.map((elem, k) => {
      res += (points.at(k)?.quantity ?? 0) * (distance_restante ?? 0);
      distance_restante -= elem.distance;
      console.log("res", res);
    });
    console.log("-km passagers", res);
    console.log("-charge moyenne", res / Dp);
    return this.formatResponse(response.routes);
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
