import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { TripDBType, TripEntity, TripType } from "../_entities/trip.entity";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export class TripService {
  static async getAll(): Promise<TripType[]> {
    // TODO changer endpoint Xano pour /trip
    const dbStops: TripDBType[] = await ServiceUtils.get("/bus-course");
    console.log("dbStops", dbStops);
    return dbStops
      ? dbStops.map((dbStop: TripDBType) => TripEntity.build(dbStop))
      : [];
  }

  static async create(
    line: TripType
  ): Promise<{ newTrip: TripType; busLines: LineType[] }> {
    const data = TripEntity.dbFormat(line);

    const dbBusTrip: {
      bus_lines: { bus_lines: LineDBType[] };
      new_trip: TripDBType;
    } = await ServiceUtils.post(
      "/busline/" + getSelectedLine()?.id + "/bus-course_v2", //TODO tester la v2
      data
    );
    console.log("dbBusTrip", dbBusTrip);

    const bus_lines = dbBusTrip.bus_lines.bus_lines;

    return {
      newTrip: TripEntity.build(dbBusTrip.new_trip),
      busLines: bus_lines
        ? bus_lines.map((dbLine: LineDBType) => BusLineEntity.build(dbLine))
        : [],
    };
  }

  static async update(trip: Partial<TripType>): Promise<TripType> {
    const data = TripEntity.dbPartialFormat(trip);
    // TODO changer endpoint Xano pour /trip
    const dbTrip: TripDBType = await ServiceUtils.patch(
      "/busline/" + getSelectedLine()?.id + "/course/" + trip.id,
      data
    );
    if (dbTrip == null) return dbTrip;
    return TripEntity.build(dbTrip);
  }

  static async delete(id: number): Promise<number> {
    // TODO changer endpoint Xano pour /trip
    return await ServiceUtils.delete(
      "/busline/" + getSelectedLine()?.id + "/course/" + id
    );
  }
}
