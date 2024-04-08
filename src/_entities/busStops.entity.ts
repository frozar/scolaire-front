import { useStateGui } from "../StateGui";
import { LocationDBType } from "./_utils.entity";

const [, { nextLeafletPointId }] = useStateGui();

export namespace BusStopEntity {
  export function build(dbBusStop: BusStopDBType) {
    return {
      id: dbBusStop.id,
      name: dbBusStop.name,
      way: dbBusStop.way_id,
      lon: dbBusStop.geo_loc.data.lng,
      lat: dbBusStop.geo_loc.data.lat,
      direction: dbBusStop.direction,
      leafletId: nextLeafletPointId(),
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
  leafletId: number;
};

export enum BusStopDirectionEnum {
  scan = "scan",
  antiscan = "antiscan",
}
