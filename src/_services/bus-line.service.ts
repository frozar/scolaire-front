import {
  BusLineDBType,
  BusLineEntity,
  BusLineType,
} from "../_entities/bus-line.entity";
import { ServiceUtils } from "./_utils.service";

export class BusLineService {
  static async getAll(): Promise<BusLineType[]> {
    const dbStops: BusLineDBType[] = await ServiceUtils.get("/bus-line");
    return dbStops.map((dbStop: BusLineDBType) => BusLineEntity.build(dbStop));
  }

  // static async create(
  //   stop: Omit<StopType, "id" | "selected" | "associated">
  // ): Promise<StopType> {
  //   const data = StopEntity.dbFormat(stop);
  //   const dbStop: StopDBType = await ServiceUtils.post("/stop", data);
  //   return StopEntity.build(dbStop);
  // }

  // static async update(
  //   stop: Omit<StopType, "associated" | "selected">
  // ): Promise<StopType> {
  //   const data = StopEntity.dbFormat(stop);
  //   const dbStop: StopDBType = await ServiceUtils.patch(
  //     "/stop/" + stop.id,
  //     data
  //   );
  //   if (dbStop == null) return dbStop;
  //   return StopEntity.build(dbStop);
  // }

  // static async delete(id: number): Promise<boolean> {
  //   return await ServiceUtils.delete("/stop/" + id);
  // }
}
