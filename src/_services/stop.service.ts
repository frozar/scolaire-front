import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { importItemDBType } from "../utils/csv.utils";
import { ServiceUtils } from "./_utils.service";

export class StopService {
  static async import(stops: importItemDBType): Promise<StopType[]> {
    const xanoResult: { stop: StopDBType[] } = await ServiceUtils.post(
      "/stop/import",
      stops
    );
    return xanoResult.stop.map((dbSchool) => StopEntity.build(dbSchool));
  }

  static async create(
    stop: Omit<
      StopType,
      "id" | "selected" | "associated" | "setSelected" | "nature" | "leafletId"
    >
  ): Promise<StopType> {
    const data = StopEntity.dbFormat(stop);
    const dbStop: StopDBType = await ServiceUtils.post("/stop", data);
    return StopEntity.build(dbStop);
  }

  static async update(
    stop: Omit<
      StopType,
      "associated" | "selected" | "setSelected" | "nature" | "leafletId"
    >
  ): Promise<StopType> {
    const data = StopEntity.dbFormat(stop);
    const dbStop: StopDBType = await ServiceUtils.patch(
      "/stop/" + stop.id,
      data
    );
    if (dbStop == null) return dbStop;
    return StopEntity.build(dbStop);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/stop/" + id);
  }
}
