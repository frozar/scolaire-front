import { createSignal } from "solid-js";
import { PathType } from "../_entities/road.entity";

export const [getPaths, setPaths] = createSignal<PathType[]>([]);

export namespace PathStore {
  export function set(paths: PathType[]) {
    setPaths(paths);
    getPaths().sort((a, b) => a.name.localeCompare(b.name));
  }

  export function add(path: PathType) {
    console.log(path);
    // TODO
  }
  export function update(path: PathType) {
    console.log(path);
    // TODO
  }
  export function remove(pathId: number) {
    console.log(pathId);
    // TODO
  }
}
