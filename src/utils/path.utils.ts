import { TripDirectionEntity } from "../_entities/trip-direction.entity";
import { TripType } from "../_entities/trip.entity";
import { getLines } from "../views/content/map/component/organism/BusLines";
import { getTrips } from "../views/content/map/component/organism/Trips";

export namespace PathUtil {
  export function tripsWherePathIsUsed(pathId: number | undefined): TripType[] {
    return getTrips().filter((trip) => trip.path?.id == pathId);
  }

  export function haveReversedTrip(trip: TripType) {
    const tripsOfPath = tripsWherePathIsUsed(trip.path?.id).filter(
      (trip_) => trip_.id != trip.id
    );

    const currentDirection = TripDirectionEntity.FindDirectionById(
      trip.tripDirectionId
    ).type;

    const haveReversedTrip = tripsOfPath.some((trip_) => {
      const tripDirection = TripDirectionEntity.FindDirectionById(
        trip_.tripDirectionId
      ).type;
      if (tripDirection != currentDirection) return true;
      return false;
    });

    return haveReversedTrip;
  }

  export function getTripUsingPath(pathId: number, lineId: number): number {
    const line = getLines().filter((line) => line.id == lineId)[0];
    return line.trips.filter((trip) => trip.path?.id == pathId).length;
  }
}
