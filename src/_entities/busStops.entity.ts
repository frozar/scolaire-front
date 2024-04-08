import { createSignal } from "solid-js";
import { LocationDBType } from "./_utils.entity";

export const [getBusStops, setBusStops] = createSignal<BusStopType[]>([]);

export namespace BusStopEntity {
  export function build(dbBusStop: BusStopDBType) {
    return {
      id: dbBusStop.id,
      name: dbBusStop.name,
      way: dbBusStop.way_id,
      lon: dbBusStop.geo_loc.data.lng,
      lat: dbBusStop.geo_loc.data.lat,
      direction: dbBusStop.direction,
    };
  }
}

export type BusStopDBType = {
  id?: number;
  name: string;
  geo_loc: LocationDBType;
  way_id: number;
  direction: BusStopDirectionEnum;
};

export type BusStopType = {
  id?: number;
  name: string;
  lon: number;
  lat: number;
  way: number;
  direction: BusStopDirectionEnum;
};

export enum BusStopDirectionEnum {
  scan = "scan",
  antiscan = "antiscan",
}
