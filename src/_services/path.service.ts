import { PathEntity, PathType } from "../_entities/path.entity";
import { ServiceUtils } from "./_utils.service";

export namespace PathService {
  export async function importPaths(paths: PathType[]) {
    const newPaths = await ServiceUtils.post("/import/paths", paths);
    return newPaths.map((path: PathType) => PathEntity.build(path));
  }

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

  export async function deletePath(pathId: number, lineId: number) {
    const deletedPath: PathType = await ServiceUtils.delete(
      "/busline/" + lineId + "/path/" + pathId
    );
    return deletedPath;
  }
}
