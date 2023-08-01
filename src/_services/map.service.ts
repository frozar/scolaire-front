import { MapDBType, MapEntity, MapType } from "../_entities/map.entity";
import { ServiceUtils } from "./_utils.service";

export class MapService {
  /**
   * Return the Map list
   * @returns
   */
  static async getAll(): Promise<MapType[]> {
    const dbMaps: MapDBType[] = await ServiceUtils.get("/map");
    return dbMaps.map((dbMap: MapDBType) => {
      return MapEntity.build(dbMap);
    });
  }

  static async create(map: Omit<MapDBType, "id">) {
    const dbMap: MapDBType = await ServiceUtils.post("/map", map);
    return MapEntity.build(dbMap);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/map/" + id);
  }
}
