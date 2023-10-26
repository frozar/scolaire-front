import { getStops } from "../views/content/map/component/organism/StopPoints";

export namespace StopUtils {
  export function getTotalQuantity(stopId: number) {
    let quantity = 0;
    const stop = getStops().filter((stop) => stop.id == stopId)[0];

    stop.associated.forEach((assoc) => (quantity += assoc.quantity));

    return quantity;
  }
}
