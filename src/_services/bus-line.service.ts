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

  static async create(line:  BusLineType): Promise<BusLineType> {
    const data = BusLineEntity.dbFormat(line);
    const dbBusLine: BusLineDBType = await ServiceUtils.post("/bus-line", data);
    return BusLineEntity.build(dbBusLine);
  }

  static async update(line: Partial<BusLineType>): Promise<BusLineType> {
    const data = BusLineEntity.dbPartialFormat(line);
    const dbBusLine: BusLineDBType = await ServiceUtils.patch(
      "/bus-line/" + line.id,
      data
    );
    if (dbBusLine == null) return dbBusLine;
    return BusLineEntity.build(dbBusLine);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/bus-line/" + id);
  }
}
