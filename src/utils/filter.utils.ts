import { StopType } from "../_entities/stop.entity";
import { StopUtils } from "./stop.utils";

export namespace FilterUtils {
  export function filterEmptyStops(stops: StopType[]) {
    return stops.filter((stop) => StopUtils.getRemainingQuantity(stop.id) > 0);
  }
}
