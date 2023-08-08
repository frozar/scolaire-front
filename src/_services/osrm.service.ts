import { BusLinePointType } from "../_entities/bus-line.entity";
import { connexionError, manageStatusCode } from "./_utils.service";

const osrm = import.meta.env.VITE_API_OSRM_URL;

export class OsrmService {
  static async getRoadPolyline(points: BusLinePointType[]) {
    const urlLnglat = points
      .map((point) => point.lon + "," + point.lat)
      .join(";");

    let response: Response;
    try {
      response = await fetch(
        osrm + "/" + urlLnglat + "?geometries=geojson&overview=full"
      );
    } catch (error) {
      connexionError();
      return false;
    }

    if (!(await manageStatusCode(response))) return;
    return (await response.json()).routes;
  }
}
