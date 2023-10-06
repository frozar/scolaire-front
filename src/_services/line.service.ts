import { BusLineEntity, LineDBType, LineType } from "../_entities/line.entity";
import { ServiceUtils } from "./_utils.service";

export class BusLineService {
  static async getAll(): Promise<LineType[]> {
    const dbLines = await ServiceUtils.get("/bus_line");
    const bus_lines: LineDBType[] = dbLines.bus_lines;
    console.log("ici", bus_lines);
    return bus_lines
      ? bus_lines.map((dbLine: LineDBType) => BusLineEntity.build(dbLine))
      : [];
  }

  static async create(line: LineType): Promise<LineType> {
    console.log("line", line);
    const data = BusLineEntity.dbFormat(line);
    const dbBusLine: LineDBType = await ServiceUtils.post("/bus_line", data);
    console.log(dbBusLine);
    return BusLineEntity.build(dbBusLine);
  }

  static async update(line: Partial<LineType>): Promise<LineType> {
    const data = BusLineEntity.dbPartialFormat(line);
    const dbBusLine: LineDBType = await ServiceUtils.patch(
      "/bus_line/" + line.id,
      data
    );
    if (dbBusLine == null) return dbBusLine;
    return BusLineEntity.build(dbBusLine);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/bus_line/" + id);
  }
}
