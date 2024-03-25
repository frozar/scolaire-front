import { RoadType } from "../_entities/road.entity";
import { setRoads } from "../views/content/paths/template/Paths";
import { ServiceUtils } from "./_utils.service";

export namespace RoadService {
  export async function create(road: Omit<RoadType, "id">) {
    const dbRoads: RoadType[] = await ServiceUtils.post("/road", road);
    setRoads(dbRoads);
  }

  export async function deleteRoad(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete("/road/" + id);
    setRoads((prev) => {
      if (!prev) return prev;
      return [...prev].filter((road) => road.id != id);
    });
    return returnValue;
  }
}
