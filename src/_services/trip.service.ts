import { TripDBType, TripEntity, TripType } from "../_entities/trip.entity";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export class TripService {
  static async getAll(): Promise<TripType[]> {
    // TODO changer endpoint Xano pour /trip
    const dbStops: TripDBType[] = await ServiceUtils.get("/trip");
    return dbStops
      ? dbStops.map((dbStop: TripDBType) => TripEntity.build(dbStop))
      : [];
  }

  static async create(line: TripType): Promise<TripType> {
    const data = TripEntity.dbFormat(line);

    const dbBusTrip: TripDBType = await ServiceUtils.post(
      "/busline/" + getSelectedLine()?.id + "/trip",
      data
    );

    return TripEntity.build(dbBusTrip);
  }

  static async update(trip: Partial<TripType>): Promise<TripType> {
    const data = TripEntity.dbPartialFormat(trip);
    // TODO changer endpoint Xano pour /trip
    const dbTrip: TripDBType = await ServiceUtils.patch(
      "/busline/" + getSelectedLine()?.id + "/trip/" + trip.id,
      data
    );
    if (dbTrip == null) return dbTrip;
    return TripEntity.build(dbTrip);
  }

  static async delete(id: number): Promise<number> {
    // TODO changer endpoint Xano pour /trip
    return await ServiceUtils.delete(
      "/busline/" + getSelectedLine()?.id + "/trip/" + id
    );
  }
}
