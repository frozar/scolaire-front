import { useStateGui } from "../StateGui";
import { EntityUtils, LocationDBType } from "./_utils.entity";

const [, { nextLeafletPointId }] = useStateGui();

export namespace BusStopEntity {
  export function build(dbBusStop: BusStopDBType) {
    if (!dbBusStop) return;
    return {
      id: dbBusStop.bus_stop_item.id,
      name: dbBusStop.bus_stop_item.name,
      way: dbBusStop.bus_stop_item.way_id,
      lon: dbBusStop.bus_stop_item.geo_loc.data.lng,
      lat: dbBusStop.bus_stop_item.geo_loc.data.lat,
      direction: dbBusStop.bus_stop_item.direction,
      leafletId: nextLeafletPointId(),
    };
  }
  export function DbFormat(busStop: BusStopType) {
    return {
      name: busStop.name,
      way_id: busStop.way,
      direction: busStop.direction,
      location: EntityUtils.builLocationPoint(busStop.lon, busStop.lat),
      school_id: busStop.schoolId,
      stop_id: busStop.stopId,
    };
  }
}

export type BusStopDBType = {
  bus_stop_item: BusStopDbAddonType;
};

type BusStopDbAddonType = {
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
  schoolId?: number;
  stopId?: number;
};

export enum BusStopDirectionEnum {
  scan = "scan",
  antiscan = "antiscan",
}
