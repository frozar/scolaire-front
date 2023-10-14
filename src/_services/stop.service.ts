import { StopDBType, StopEntity, StopType } from "../_entities/stop.entity";
import { ServiceUtils } from "./_utils.service";

export class StopService {
  static async getAll(): Promise<StopType[]> {
    const dbStops: { stop: StopDBType[] } = await ServiceUtils.get("/stops_v2");
    return dbStops
      ? dbStops.stop.map((dbStop: StopDBType) => StopEntity.build(dbStop))
      : [];
  }

  static async import(
    stops: Pick<StopDBType, "name" | "location">[]
  ): Promise<StopType[]> {
    const xanoResult: StopDBType[] = await ServiceUtils.post("/stop/import", {
      stops: stops,
    });
    return xanoResult.map((dbSchool) => StopEntity.build(dbSchool));
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
