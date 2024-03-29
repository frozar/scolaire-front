import { MapDBType, MapEntity, MapType } from "../_entities/map.entity";
import { defaultBoundingBox } from "../_stores/map.store";
import { getSelectedOrganisation } from "../views/content/board/component/organism/OrganisationSelector";
import { ServiceUtils } from "./_utils.service";

export class MapService {
  static async getAll(): Promise<MapType[]> {
    const organisationId = getSelectedOrganisation().organisation_id;
    if (organisationId == -1) return [];
    const dbMaps: MapDBType[] = await ServiceUtils.get(
      "/organisation/" + organisationId + "/map",
      false
    );
    return dbMaps
      ? dbMaps.map((dbMap: MapDBType) => {
          return MapEntity.build(dbMap);
        })
      : [];
  }

  static async create(map: Partial<MapDBType>) {
    if (!map.bounding_box) {
      map.bounding_box = defaultBoundingBox;
    }

    const dbMap: MapDBType = await ServiceUtils.post(
      "/map",
      { ...map, organisation_id: getSelectedOrganisation().organisation_id },
      false
    );
    return MapEntity.build(dbMap);
  }

  static async delete(id: number): Promise<boolean> {
    return await ServiceUtils.delete("/map/" + id, false);
  }

  static async update(map: Partial<MapType>) {
    const dbMap: MapDBType = await ServiceUtils.patch(
      "/map/" + map.id,
      {
        ...map,
        organisation_id: getSelectedOrganisation().organisation_id,
      },
      false
    );
    return MapEntity.build(dbMap);
  }
}
