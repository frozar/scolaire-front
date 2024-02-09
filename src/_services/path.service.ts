import { PathType } from "../_entities/path.entity";
import { getSelectedLine } from "../views/content/map/component/organism/BusLines";
import { ServiceUtils } from "./_utils.service";

export namespace PathService {
  export async function create(path: PathType) {
    const lineId = getSelectedLine()?.id;
    const createdPath: PathType = await ServiceUtils.post(
      "/busline/" + lineId + "/path",
      path
    );
    return createdPath;
  }

  export async function update(path: PathType, lineId: number) {
    const updatedPath: PathType = await ServiceUtils.patch(
      "/busline/" + lineId + "/path/" + path.id,
      path
    );
    return updatedPath;
  }
}
