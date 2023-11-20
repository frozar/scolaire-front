import { LineType } from "../_entities/line.entity";
import { getLines } from "../views/content/map/component/organism/BusLines";

export namespace TripUtils {
  export function get(tripId: number) {
    return getLines()
      .flatMap((line) => line.trips)
      .filter((trip) => trip.id == tripId)[0];
  }

  export function getLine(tripId: number): LineType {
    return getLines().filter((line) =>
      line.trips.some((trip) => trip.id == tripId)
    )[0];
  }
}
