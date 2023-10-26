import { NatureEnum } from "../type";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getStops } from "../views/content/map/component/organism/StopPoints";

export namespace StopUtils {
  export function getTotalQuantity(stopId: number) {
    let quantity = 0;
    const stop = getStops().filter((stop) => stop.id == stopId)[0];

    stop.associated.forEach((assoc) => (quantity += assoc.quantity));

    return quantity;
  }

  export function getRemainingQuantity(stopId: number) {
    const totalQuantity = getTotalQuantity(stopId);

    let usedQuantity = 0;
    getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter(
        (tripPoint) =>
          tripPoint.nature == NatureEnum.stop && tripPoint.id == stopId
      )
      .flatMap((_tripPoint) => _tripPoint.grades)
      .forEach((grade) => (usedQuantity += grade.quantity));

    return totalQuantity - usedQuantity;
  }
}
