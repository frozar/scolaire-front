import { PathType } from "../_entities/road.entity";
import { ServiceUtils } from "./_utils.service";

export namespace PathService {
  export async function create(road: Omit<PathType, "id">) {
    const dbRoads: PathType[] = await ServiceUtils.post("/road", road);

    //TODO use PathStore.add + changer le retour de Xano
    console.log("TODO path.service->create", dbRoads);
    // setRoads(dbRoads);
  }

  export async function update(road: Partial<PathType>) {
    const dbRoads: PathType[] = await ServiceUtils.patch(
      "/road/" + road.id,
      road
    );
    //TODO use PathStore.update + changer le retour de Xano
    console.log("TODO path.service->update", dbRoads);
    // setRoads(dbRoads);
  }

  export async function deleteRoad(id?: number): Promise<boolean> {
    const returnValue: boolean = await ServiceUtils.delete("/road/" + id);

    //TODO use PathStore.delete + changer le retour de Xano
    console.log("TODO path.service->delete");
    // setRoads((prev) => {
    //   if (!prev) return prev;
    //   return [...prev].filter((road) => road.id != id);
    // });
    return returnValue;
  }
}
