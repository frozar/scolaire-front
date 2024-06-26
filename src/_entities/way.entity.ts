import L from "leaflet";
import { DBway } from "../_services/osrm.service";

export namespace wayEntity {
  export function build(dbway: DBway) {
    const obj = JSON.parse(dbway.line);
    return {
      id: dbway.id,
      name: dbway.name,
      coordinates: dbway.line
        ? obj.coordinates.map((item) => {
            return L.latLng(Number(item[1]), Number(item[0]));
          })
        : [],
      selected: false,
    };
  }
}

export type WayType = {
  id: number;
  coordinates?: L.LatLng[];
  name: string;
  selected: boolean;
  color?: string;
};
