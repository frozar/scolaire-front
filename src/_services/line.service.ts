import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { ServiceUtils } from "./_utils.service";

export class BusLineService {
  static async create(line: LineType): Promise<LineType> {
    const data = BusLineEntity.dbFormat(line);
    const dbLine: LineDBType = await ServiceUtils.post("/bus_line", data);

    return BusLineEntity.build(dbLine);
  }

  static async update(line: LineType): Promise<LineType> {
    const data = BusLineEntity.dbFormat(line);
    const dbBusLine: LineDBType = await ServiceUtils.patch(
      "/bus_line/" + line.id,
      data
    );

    if (dbBusLine == null) return dbBusLine;
    return BusLineEntity.build(dbBusLine);
  }

  static async delete(id: number): Promise<number> {
    return await ServiceUtils.delete("/bus_line/" + id);
  }
}
