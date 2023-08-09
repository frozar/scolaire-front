import L from "leaflet";
import { BusLinePointType } from "../_entities/bus-line.entity";
import { connexionError, manageStatusCode } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

export class OsrmService {
  static async getRoadPolyline(
    points: BusLinePointType[]
  ): Promise<L.LatLng[]> {
    let response: Response;
    try {
      response = await fetch(
        osrm +
          "/" +
          this.buildPositionURL(points) +
          "?geometries=geojson&overview=full"
      );
    } catch (error) {
      connexionError();
      return [];
    }

    if (!(await manageStatusCode(response))) return [];
    return await this.formatResponse(response);
  }

  private static buildPositionURL(points: BusLinePointType[]): string {
    return points.map((point) => point.lon + "," + point.lat).join(";");
  }

  private static async formatResponse(response: Response): Promise<L.LatLng[]> {
    const routes = (await response.json()).routes;
    if (!routes) {
      console.log("Error : could find the path");
      return [];
    }
    const coordinates = routes[0].geometry.coordinates;
    return coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0]));
  }
}
