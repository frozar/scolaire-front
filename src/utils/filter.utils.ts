import { StopType } from "../_entities/stop.entity";
import { QuantityUtils } from "./quantity.utils";

export namespace FilterUtils {
  export function filterEmptyStops(stops: StopType[]) {
    return stops.filter((stop) =>
      QuantityUtils.stopHasRemainingStudentToGet(stop.id)
    );
  }
}
