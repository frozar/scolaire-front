import { BusStopEntity, BusStopType } from "../_entities/busStops.entity";
import { ServiceUtils } from "./_utils.service";

export namespace BusStopService {
  export async function add(busStop: Omit<BusStopType, "id">) {
    const data = BusStopEntity.DbFormat(busStop);
    let url = "/stop/" + busStop.stopId + "/bus_stop";
    if (data.school_id) url = "/school/" + busStop.schoolId + "/bus_stop";
    const dbBusStop = await ServiceUtils.post(url, data);
    return BusStopEntity.build(dbBusStop);
  }

  export async function create(busStop: Omit<BusStopType, "id">) {
    const data = BusStopEntity.DbFormat(busStop);
    const dbBusStop = await ServiceUtils.post("/bus_stops", data);
    return BusStopEntity.build(dbBusStop);
  }
}
