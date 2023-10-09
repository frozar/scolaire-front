import {
  BusLineEntity,
  DbDataLineType,
  LineDBType,
  LineType,
} from "../_entities/line.entity";
import { setLines } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export class BusLineService {
  static async getAll(): Promise<LineType[]> {
    const dbLines = await ServiceUtils.get("/bus_line");

    const bus_lines: LineDBType[] = dbLines.bus_lines;
    return bus_lines
      ? bus_lines.map((dbLine: LineDBType) => BusLineEntity.build(dbLine))
      : [];
  }

  static async create(line: LineType): Promise<LineType> {
    const data = BusLineEntity.dbFormat(line);

    const dbData: DbDataLineType = await ServiceUtils.post("/bus_line", data);

    const dbLine: LineDBType = dbData.bus_lines.bus_lines.filter(
      (line) => line.id === dbData.new_bus_line.id
    )[0];

    const bus_lines: LineDBType[] = dbData.bus_lines.bus_lines;
    setLines(
      bus_lines
        ? bus_lines.map((dbLine: LineDBType) => BusLineEntity.build(dbLine))
        : []
    );
    return BusLineEntity.build(dbLine);
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
