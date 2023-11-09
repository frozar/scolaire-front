import { getLines } from "../views/content/map/component/organism/BusLines";

export namespace TripUtils {
  export function get(tripId: number) {
    return getLines()
      .flatMap((line) => line.trips)
      .filter((trip) => trip.id == tripId)[0];
  }
}
