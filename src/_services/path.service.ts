import { PathType } from "../_entities/path.entity";
import { ServiceUtils } from "./_utils.service";

export namespace PathService {
  export async function create(path: PathType, lineId: number) {
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
