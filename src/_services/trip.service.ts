import { TripDBType, TripEntity, TripType } from "../_entities/trip.entity";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export class TripService {
  static async create(trip: TripType): Promise<TripType> {
    const data = TripEntity.dbFormat(trip);

    const dbBusTrip: TripDBType = await ServiceUtils.post(
      "/busline/" + getSelectedLine()?.id + "/trip",
      data
    );

    return TripEntity.build(dbBusTrip);
  }

  static async update(trip: Partial<TripType>): Promise<TripType> {
    const data = TripEntity.dbPartialFormat(trip);
    const dbTrip: TripDBType = await ServiceUtils.patch(
      "/busline/" + getSelectedLine()?.id + "/trip/" + trip.id,
      data
    );

    console.log("dbTrip:", dbTrip);
    console.log("dbTrip builded:", TripEntity.build(dbTrip));

    if (dbTrip == null) return dbTrip;
    return TripEntity.build(dbTrip);
  }

  static async delete(id: number): Promise<number> {
    return await ServiceUtils.delete(
      "/busline/" + getSelectedLine()?.id + "/trip/" + id
    );
  }
}
