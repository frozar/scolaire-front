import { TripDBType, TripEntity, TripType } from "../_entities/trip.entity";
import { ServiceUtils } from "./_utils.service";

export class TripService {
  static async create(trip: TripType): Promise<TripType> {
    const data = TripEntity.dbFormat(trip);

    const dbBusTrip: TripDBType = await ServiceUtils.post(
      "/busline/" + trip.lineId + "/trip",
      data
    );

    return TripEntity.build(dbBusTrip, trip.lineId);
  }

  static async update(trip: TripType): Promise<TripType> {
    const data = TripEntity.dbFormat(trip);

    const dbTrip: TripDBType = await ServiceUtils.patch(
      "/busline/" + trip.lineId + "/trip/" + trip.id,
      data
    );

    if (dbTrip == null) return dbTrip;
    return TripEntity.build(dbTrip, trip.lineId);
  }

  static async delete(trip: TripType): Promise<number> {
    return await ServiceUtils.delete(
      "/busline/" + trip.lineId + "/trip/" + trip.id
    );
  }
}
