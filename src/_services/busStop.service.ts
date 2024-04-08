import {
  BusStopDBType,
  BusStopEntity,
  BusStopType,
} from "../_entities/busStops.entity";
import { ServiceUtils } from "./_utils.service";

export namespace BusStopService {
  export async function create(busStop: Omit<BusStopType, "id">) {
    const data = BusStopEntity.DbFormat(busStop);
    const dbBusStop: BusStopDBType = await ServiceUtils.post(
      "/school/" + busStop.schoolId + "/bus_stop",
      data
    );
    return BusStopEntity.build(dbBusStop);
  }
}
