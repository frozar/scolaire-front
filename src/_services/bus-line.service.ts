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

  static async update(line: Partial<BusLineType>): Promise<BusLineType> {
    const data = BusLineEntity.dbPartialFormat(line);
    const dbBusLine: BusLineDBType = await ServiceUtils.patch(
      "/bus-line/" + line.id,
      data
    );
    if (dbBusLine == null) return dbBusLine;
    return BusLineEntity.build(dbBusLine);
  }

  // static async delete(id: number): Promise<boolean> {
  //   return await ServiceUtils.delete("/stop/" + id);
  // }
}
