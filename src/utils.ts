import { LatLng } from "leaflet";

export function toLatLng(elt: number[]) {
  const lat = elt[1];
  const lng = elt[0];
  const alt = elt[2];
  return new LatLng(lat, lng, alt);
}

export function geomToLatLng(geom: string): LatLng[] {
  return JSON.parse(geom).coordinates.map(toLatLng);
}

export interface Troncon {
  cleabs: string;
  the_geom: string;
}

export interface Road {
  troncons: Troncon[];
}

export function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
}
