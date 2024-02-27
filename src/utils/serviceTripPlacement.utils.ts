import { TripDirectionEnum } from "../_entities/trip-direction.entity";

export namespace ServiceTripPlacementUtils {
  // TODO: Remove export
  export function isCase2(
    earliestDepartureHour: number,
    earliestEndHour: number,
    tripDirection: TripDirectionEnum,
    minTimeOfTimeRange: number,
    maxTimeOfTimeRange: number
  ): boolean {
    /* Case2 => Earliest arrival or departure in the time range */

    return tripDirection == TripDirectionEnum.going
      ? /* Aller */
        minTimeOfTimeRange <= earliestEndHour &&
          earliestEndHour <= maxTimeOfTimeRange
      : /* Retour */
        minTimeOfTimeRange <= earliestDepartureHour &&
          earliestDepartureHour <= maxTimeOfTimeRange;
  }
}
